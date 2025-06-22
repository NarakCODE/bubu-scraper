import axios from "axios";
import * as cheerio from "cheerio";
import { URL } from "url";
import * as fs from "fs";
import * as path from "path";

export interface ScrapedData {
    title: string;
    description: string;
    emails: string[];
    phoneNumbers: string[];
    socialLinks: {
        [platform: string]: string;
    };
    images: string[];
    videos: string[];
    documents: string[];
}

export interface MediaDownloadOptions {
    downloadPath?: string;
    maxFileSize?: number; // in MB
    allowedImageTypes?: string[];
    allowedVideoTypes?: string[];
    allowedDocTypes?: string[];
    maxConcurrentDownloads?: number;
}

export interface DownloadResult {
    url: string;
    filePath?: string;
    success: boolean;
    error?: string;
    fileSize?: number;
    fileName?: string;
}

/**
 * Scrapes a given URL for contact information and media.
 * @param url The website URL to scrape.
 * @returns An object containing the extracted information.
 */
export async function scrapeWebsite(url: string): Promise<ScrapedData> {
    try {
        const { data: html } = await axios.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
            timeout: 10000, // Add timeout
            maxRedirects: 5, // Limit redirects
        });

        const $ = cheerio.load(html);

        // Improved title extraction with fallbacks
        const title = extractTitle($);
        const description = extractDescription($);
        const emails = extractEmails($);
        const phoneNumbers = extractPhoneNumbers($);
        const socialLinks = extractSocialLinks($);
        const images = extractImages($, url);
        const videos = extractVideos($, url);
        const documents = extractDocuments($, url);

        console.log(`Scraped from ${url}:`, {
            title,
            description,
            emails: emails.length,
            phoneNumbers: phoneNumbers.length,
            socialLinks: Object.keys(socialLinks).length,
            images: images.length,
            videos: videos.length,
            documents: documents.length,
        });

        return {
            title,
            description,
            emails,
            phoneNumbers,
            socialLinks,
            images,
            videos,
            documents,
        };
    } catch (error) {
        console.error(`Error scraping website: ${url}`, error);
        return {
            title: "",
            description: "",
            emails: [],
            phoneNumbers: [],
            socialLinks: {},
            images: [],
            videos: [],
            documents: [],
        };
    }
}

// --- Improved Helper Functions ---

function extractTitle($: cheerio.Root): string {
    // Try multiple selectors in order of preference
    const titleSelectors = [
        "title",
        "h1:first",
        'meta[property="og:title"]',
        'meta[name="twitter:title"]',
        ".title",
        "#title",
    ];

    for (const selector of titleSelectors) {
        let title = "";
        if (selector.startsWith("meta")) {
            title = $(selector).attr("content") || "";
        } else {
            title = $(selector).text().trim();
        }

        if (title && title.length > 0) {
            return title;
        }
    }

    return "";
}

function extractDescription($: cheerio.Root): string {
    // Try multiple meta description sources
    const descriptionSelectors = [
        'meta[name="description"]',
        'meta[property="og:description"]',
        'meta[name="twitter:description"]',
        'meta[name="Description"]', // Some sites use capital D
    ];

    for (const selector of descriptionSelectors) {
        const description = $(selector).attr("content");
        if (description && description.trim().length > 0) {
            return description.trim();
        }
    }

    return "";
}

function extractEmails($: cheerio.Root): string[] {
    const emails = new Set<string>();

    // Improved email regex - more accurate
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

    // 1. Check mailto links first
    $('a[href^="mailto:"]').each((_, element) => {
        const href = $(element).attr("href");
        if (href) {
            const email = href.replace(/^mailto:/, "").split("?")[0]; // Remove query params
            if (isValidEmail(email)) {
                emails.add(email.toLowerCase());
            }
        }
    });

    // 2. Look for emails in specific contact-related elements
    const contactSelectors = [
        ".contact",
        ".contact-info",
        ".contact-details",
        ".footer",
        ".header",
        ".about",
        '[class*="contact"]',
        '[id*="contact"]',
        '[class*="email"]',
        '[id*="email"]',
    ];

    contactSelectors.forEach((selector) => {
        $(selector).each((_, element) => {
            const text = $(element).text();
            const foundEmails = text.match(emailRegex);
            if (foundEmails) {
                foundEmails.forEach((email) => {
                    if (isValidEmail(email)) {
                        emails.add(email.toLowerCase());
                    }
                });
            }
        });
    });

    // 3. Scan entire body as last resort (but be more selective)
    if (emails.size === 0) {
        const bodyText = $("body").text();
        const foundInText = bodyText.match(emailRegex);
        if (foundInText) {
            foundInText.forEach((email) => {
                if (isValidEmail(email) && !isCommonFalsePositive(email)) {
                    emails.add(email.toLowerCase());
                }
            });
        }
    }

    return Array.from(emails);
}

function extractPhoneNumbers($: cheerio.Root): string[] {
    const phoneNumbers = new Set<string>();

    // Multiple phone number patterns
    const phonePatterns = [
        // US format: (123) 456-7890, 123-456-7890, 123.456.7890
        /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
        // International: +1-123-456-7890, +44 20 1234 5678
        /\+\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
        // Simple formats: 1234567890, 123 456 7890
        /\b\d{3}\s?\d{3}\s?\d{4}\b/g,
    ];

    // Look in contact-specific areas first
    const contactSelectors = [
        ".contact",
        ".contact-info",
        ".phone",
        ".tel",
        '[class*="contact"]',
        '[id*="contact"]',
        '[class*="phone"]',
        '[id*="phone"]',
        'a[href^="tel:"]',
    ];

    // Check tel: links first
    $('a[href^="tel:"]').each((_, element) => {
        const href = $(element).attr("href");
        if (href) {
            const phone = href
                .replace(/^tel:/, "")
                .replace(/[^\d+()-.\s]/g, "");
            if (phone.length >= 10) {
                phoneNumbers.add(phone);
            }
        }
    });

    // Check contact sections
    contactSelectors.forEach((selector) => {
        $(selector).each((_, element) => {
            const text = $(element).text();
            phonePatterns.forEach((pattern) => {
                const matches = text.match(pattern);
                if (matches) {
                    matches.forEach((phone) => {
                        const cleanPhone = phone.trim();
                        if (isValidPhone(cleanPhone)) {
                            phoneNumbers.add(cleanPhone);
                        }
                    });
                }
            });
        });
    });

    // If no phones found, search broader
    if (phoneNumbers.size === 0) {
        const bodyText = $("body").text();
        phonePatterns.forEach((pattern) => {
            const matches = bodyText.match(pattern);
            if (matches) {
                matches.forEach((phone) => {
                    const cleanPhone = phone.trim();
                    if (
                        isValidPhone(cleanPhone) &&
                        !isPhoneFalsePositive(cleanPhone)
                    ) {
                        phoneNumbers.add(cleanPhone);
                    }
                });
            }
        });
    }

    return Array.from(phoneNumbers);
}

function extractSocialLinks($: cheerio.Root): { [platform: string]: string } {
    const links: { [platform: string]: string } = {};

    // Expanded social platforms with better matching
    const socialPlatforms = [
        { name: "linkedin", patterns: ["linkedin.com", "linkedin"] },
        { name: "twitter", patterns: ["twitter.com", "x.com", "twitter"] },
        { name: "facebook", patterns: ["facebook.com", "fb.com", "facebook"] },
        {
            name: "instagram",
            patterns: ["instagram.com", "instagr.am", "instagram"],
        },
        { name: "github", patterns: ["github.com", "github"] },
        { name: "youtube", patterns: ["youtube.com", "youtu.be", "youtube"] },
        { name: "tiktok", patterns: ["tiktok.com", "tiktok"] },
        { name: "pinterest", patterns: ["pinterest.com", "pinterest"] },
        { name: "snapchat", patterns: ["snapchat.com", "snapchat"] },
    ];

    $("a").each((_, element) => {
        const href = $(element).attr("href");
        if (href) {
            const lowerHref = href.toLowerCase();

            for (const platform of socialPlatforms) {
                if (!links[platform.name]) {
                    for (const pattern of platform.patterns) {
                        if (lowerHref.includes(pattern)) {
                            // Make sure it's actually a profile/page link, not just a mention
                            if (isValidSocialLink(href, pattern)) {
                                links[platform.name] = href;
                                break;
                            }
                        }
                    }
                }
            }
        }
    });

    return links;
}

function extractImages($: cheerio.Root, baseUrl: string): string[] {
    const images = new Set<string>();

    // Look for images in multiple ways
    const imageSelectors = [
        "img[src]",
        "img[data-src]", // Lazy loaded images
        "img[data-lazy]",
        '[style*="background-image"]', // CSS background images
    ];

    imageSelectors.forEach((selector) => {
        $(selector).each((_, element) => {
            let src = "";

            if (selector === '[style*="background-image"]') {
                const style = $(element).attr("style") || "";
                const match = style.match(
                    /background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/
                );
                if (match) {
                    src = match[1];
                }
            } else {
                src =
                    $(element).attr("src") ||
                    $(element).attr("data-src") ||
                    $(element).attr("data-lazy") ||
                    "";
            }

            if (src) {
                try {
                    // Skip data URLs and very small images
                    if (
                        src.startsWith("data:") ||
                        src.includes("1x1") ||
                        src.includes("pixel")
                    ) {
                        return;
                    }

                    const absoluteUrl = new URL(src, baseUrl).href;

                    // Basic filter for reasonable image URLs
                    if (isValidImageUrl(absoluteUrl)) {
                        images.add(absoluteUrl);
                    }
                } catch (error) {
                    console.warn(`Could not resolve image URL: ${src}`);
                }
            }
        });
    });

    return Array.from(images);
}

function extractVideos($: cheerio.Root, baseUrl: string): string[] {
    const videos = new Set<string>();

    // Video selectors
    const videoSelectors = [
        "video[src]",
        "video source[src]",
        'iframe[src*="youtube"]',
        'iframe[src*="vimeo"]',
        'iframe[src*="dailymotion"]',
        'a[href$=".mp4"]',
        'a[href$=".webm"]',
        'a[href$=".mov"]',
        'a[href$=".avi"]',
    ];

    videoSelectors.forEach((selector) => {
        $(selector).each((_, element) => {
            let src = $(element).attr("src") || $(element).attr("href") || "";

            if (src) {
                try {
                    const absoluteUrl = new URL(src, baseUrl).href;
                    if (isValidVideoUrl(absoluteUrl)) {
                        videos.add(absoluteUrl);
                    }
                } catch (error) {
                    console.warn(`Could not resolve video URL: ${src}`);
                }
            }
        });
    });

    return Array.from(videos);
}

function extractDocuments($: cheerio.Root, baseUrl: string): string[] {
    const documents = new Set<string>();

    // Document selectors
    const docExtensions = [
        ".pdf",
        ".doc",
        ".docx",
        ".xls",
        ".xlsx",
        ".ppt",
        ".pptx",
        ".txt",
        ".rtf",
    ];

    $("a").each((_, element) => {
        const href = $(element).attr("href");
        if (href) {
            const lowerHref = href.toLowerCase();
            if (docExtensions.some((ext) => lowerHref.includes(ext))) {
                try {
                    const absoluteUrl = new URL(href, baseUrl).href;
                    documents.add(absoluteUrl);
                } catch (error) {
                    console.warn(`Could not resolve document URL: ${href}`);
                }
            }
        }
    });

    return Array.from(documents);
}

/**
 * Downloads media files from scraped URLs
 * @param scrapedData The scraped data containing media URLs
 * @param options Download configuration options
 * @returns Promise with download results for each media file
 */
export async function downloadMedia(
    scrapedData: ScrapedData,
    options: MediaDownloadOptions = {}
): Promise<DownloadResult[]> {
    const defaultOptions: Required<MediaDownloadOptions> = {
        downloadPath: "./downloads",
        maxFileSize: 50, // 50MB
        allowedImageTypes: [
            ".jpg",
            ".jpeg",
            ".png",
            ".gif",
            ".webp",
            ".svg",
            ".bmp",
        ],
        allowedVideoTypes: [".mp4", ".webm", ".mov", ".avi", ".mkv"],
        allowedDocTypes: [
            ".pdf",
            ".doc",
            ".docx",
            ".xls",
            ".xlsx",
            ".ppt",
            ".pptx",
            ".txt",
        ],
        maxConcurrentDownloads: 5,
    };

    const config = { ...defaultOptions, ...options };

    // Create download directory if it doesn't exist
    if (!fs.existsSync(config.downloadPath)) {
        fs.mkdirSync(config.downloadPath, { recursive: true });
    }

    // Collect all media URLs
    const allMediaUrls = [
        ...scrapedData.images,
        ...scrapedData.videos,
        ...scrapedData.documents,
    ];

    console.log(`Starting download of ${allMediaUrls.length} media files...`);

    // Process downloads in batches to control concurrency
    const results: DownloadResult[] = [];
    const batches = chunkArray(allMediaUrls, config.maxConcurrentDownloads);

    for (const batch of batches) {
        const batchPromises = batch.map((url) =>
            downloadSingleFile(url, config)
        );
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
    }

    const successful = results.filter((r) => r.success).length;
    console.log(
        `Download complete: ${successful}/${results.length} files downloaded successfully`
    );

    return results;
}

/**
 * Downloads a single file
 */
async function downloadSingleFile(
    url: string,
    config: Required<MediaDownloadOptions>
): Promise<DownloadResult> {
    try {
        // Validate file type
        if (!isAllowedFileType(url, config)) {
            return {
                url,
                success: false,
                error: "File type not allowed",
            };
        }

        // Get file info first (HEAD request)
        const headResponse = await axios.head(url, {
            timeout: 10000,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
        });

        // Check file size
        const contentLength = parseInt(
            headResponse.headers["content-length"] || "0"
        );
        const fileSizeMB = contentLength / (1024 * 1024);

        if (fileSizeMB > config.maxFileSize) {
            return {
                url,
                success: false,
                error: `File too large: ${fileSizeMB.toFixed(2)}MB (max: ${
                    config.maxFileSize
                }MB)`,
                fileSize: contentLength,
            };
        }

        // Generate filename
        const fileName = generateFileName(
            url,
            headResponse.headers["content-type"]
        );
        const filePath = path.join(config.downloadPath, fileName);

        // Check if file already exists
        if (fs.existsSync(filePath)) {
            return {
                url,
                filePath,
                success: true,
                error: "File already exists (skipped)",
                fileSize: contentLength,
                fileName,
            };
        }

        // Download the file
        const response = await axios.get(url, {
            responseType: "stream",
            timeout: 30000,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
        });

        // Save to file
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve) => {
            writer.on("finish", () => {
                resolve({
                    url,
                    filePath,
                    success: true,
                    fileSize: contentLength,
                    fileName,
                });
            });

            writer.on("error", (error) => {
                resolve({
                    url,
                    success: false,
                    error: error.message,
                });
            });
        });
    } catch (error: any) {
        return {
            url,
            success: false,
            error: error.message || "Download failed",
        };
    }
}

/**
 * Generates a safe filename from URL and content type
 */
function generateFileName(url: string, contentType?: string): string {
    try {
        const urlObj = new URL(url);
        let fileName = path.basename(urlObj.pathname);

        // If no filename in URL, generate one
        if (!fileName || fileName === "/" || !fileName.includes(".")) {
            const timestamp = Date.now();

            // Try to get extension from content type
            let extension = "";
            if (contentType) {
                const mimeToExt: { [key: string]: string } = {
                    "image/jpeg": ".jpg",
                    "image/png": ".png",
                    "image/gif": ".gif",
                    "image/webp": ".webp",
                    "video/mp4": ".mp4",
                    "video/webm": ".webm",
                    "application/pdf": ".pdf",
                    "text/plain": ".txt",
                };
                extension = mimeToExt[contentType] || "";
            }

            fileName = `media_${timestamp}${extension}`;
        }

        // Sanitize filename
        fileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");

        // Ensure filename isn't too long
        if (fileName.length > 100) {
            const ext = path.extname(fileName);
            const name = path.basename(fileName, ext);
            fileName = name.substring(0, 100 - ext.length) + ext;
        }

        return fileName;
    } catch {
        return `media_${Date.now()}.bin`;
    }
}

/**
 * Checks if file type is allowed based on URL and config
 */
function isAllowedFileType(
    url: string,
    config: Required<MediaDownloadOptions>
): boolean {
    const lowerUrl = url.toLowerCase();

    const allAllowedTypes = [
        ...config.allowedImageTypes,
        ...config.allowedVideoTypes,
        ...config.allowedDocTypes,
    ];

    return allAllowedTypes.some((ext) => lowerUrl.includes(ext));
}

/**
 * Splits array into chunks
 */
function chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

// --- Validation Helper Functions ---

function isValidEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
    return emailRegex.test(email) && email.length < 100; // Reasonable length limit
}

function isCommonFalsePositive(email: string): boolean {
    const falsePositives = [
        "example@example.com",
        "test@test.com",
        "user@domain.com",
        "info@example.com",
    ];
    return falsePositives.includes(email.toLowerCase());
}

function isValidPhone(phone: string): boolean {
    // Remove all non-digit characters to count digits
    const digitsOnly = phone.replace(/\D/g, "");

    // Phone should have 10-15 digits
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        return false;
    }

    // Avoid obvious false positives like dates or IDs
    if (digitsOnly.startsWith("19") || digitsOnly.startsWith("20")) {
        return false; // Likely a year
    }

    return true;
}

function isPhoneFalsePositive(phone: string): boolean {
    const digitsOnly = phone.replace(/\D/g, "");

    // Common false positives
    const falsePositives = ["1234567890", "0000000000", "1111111111"];

    return falsePositives.includes(digitsOnly);
}

function isValidSocialLink(url: string, platform: string): boolean {
    // Make sure it's not just a share button or widget
    const invalidPatterns = [
        "share",
        "widget",
        "button",
        "follow",
        "like",
        "intent/tweet",
        "sharer.php",
    ];

    const lowerUrl = url.toLowerCase();
    return !invalidPatterns.some((pattern) => lowerUrl.includes(pattern));
}

function isValidImageUrl(url: string): boolean {
    // Check for common image extensions
    const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".svg",
        ".bmp",
    ];
    const lowerUrl = url.toLowerCase();

    // Either has image extension or is from common image domains
    return (
        imageExtensions.some((ext) => lowerUrl.includes(ext)) ||
        lowerUrl.includes("images") ||
        lowerUrl.includes("media") ||
        lowerUrl.includes("photo") ||
        lowerUrl.includes("img")
    );
}

function isValidVideoUrl(url: string): boolean {
    const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv"];
    const videoSites = ["youtube.com", "vimeo.com", "dailymotion.com"];
    const lowerUrl = url.toLowerCase();

    return (
        videoExtensions.some((ext) => lowerUrl.includes(ext)) ||
        videoSites.some((site) => lowerUrl.includes(site))
    );
}
