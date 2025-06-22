import axios from "axios";
import * as cheerio from "cheerio";
import { URL } from "url";

// 1. Update the ScrapedData interface to include the new fields
export interface ScrapedData {
    title: string;
    description: string;
    emails: string[];
    phoneNumbers: string[];
    socialLinks: {
        [platform: string]: string;
    };
    images: string[];
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
                // Use a common user-agent to avoid being blocked
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
        });

        const $ = cheerio.load(html);

        // 2. Extract all the new data points
        const title = $("title").text() || $("h1").first().text();
        const description = $('meta[name="description"]').attr("content") || "";

        const emails = extractEmails($);
        const phoneNumbers = extractPhoneNumbers($);
        const socialLinks = extractSocialLinks($);
        const images = extractImages($, url);

        console.log(`Scraped from ${url}:`, {
            title,
            description,
            emails,
            phoneNumbers,
            socialLinks,
            images,
        });

        // 3. Return the complete, structured data
        return {
            title,
            description,
            emails,
            phoneNumbers,
            socialLinks,
            images,
        };
    } catch (error) {
        console.error(`Error scraping website: ${url}`, error);
        // Return an empty structure in case of an error
        return {
            title: "",
            description: "",
            emails: [],
            phoneNumbers: [],
            socialLinks: {},
            images: [],
        };
    }
}

// --- Helper Functions ---

function extractEmails($: cheerio.Root): string[] {
    const emails = new Set<string>();

    // This regex is more comprehensive and widely used for finding emails.
    const emailRegex =
        /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;

    // 1. Look in mailto links (still a good place to check first)
    $('a[href^="mailto:"]').each((_, element) => {
        const href = $(element).attr("href");
        if (href) {
            // Clean the 'mailto:' part
            const cleanHref = href.replace(/mailto:/g, "");
            const foundEmails = cleanHref.match(emailRegex);
            if (foundEmails) {
                foundEmails.forEach((email) => emails.add(email));
            }
        }
    });

    // 2. Scan the entire body text for email patterns
    const bodyText = $("body").text();
    const foundInText = bodyText.match(emailRegex);
    if (foundInText) {
        foundInText.forEach((email) => emails.add(email));
    }

    return Array.from(emails);
}

/**
 * NEW: Extracts phone numbers from the page text using regex.
 */
function extractPhoneNumbers($: cheerio.Root): string[] {
    const phoneNumbers = new Set<string>();

    // This regex is more flexible. It looks for sequences of digits that are
    // separated by spaces, dots, dashes, or parentheses, and can optionally
    // start with a '+' country code.
    const phoneRegex =
        /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

    const bodyText = $("body").text();

    // Replace common textual representations of numbers
    const cleanText = bodyText
        .replace(/(\s)dot(\s)/gi, ".")
        .replace(/(\s)at(\s)/gi, "@");

    const foundPhones = cleanText.match(phoneRegex);

    if (foundPhones) {
        foundPhones.forEach((phone) => {
            // Further cleaning to remove any unwanted characters before adding
            if (phone.trim().length > 8) {
                // A basic filter for valid-looking numbers
                phoneNumbers.add(phone.trim());
            }
        });
    }

    return Array.from(phoneNumbers);
}

function extractSocialLinks($: cheerio.Root): { [platform: string]: string } {
    const links: { [platform: string]: string } = {};
    const socialPlatforms = [
        "linkedin",
        "twitter",
        "facebook",
        "instagram",
        "github",
        "youtube",
    ];

    $("a").each((_, element) => {
        const href = $(element).attr("href");
        if (href) {
            for (const platform of socialPlatforms) {
                if (href.includes(platform) && !links[platform]) {
                    links[platform] = href;
                }
            }
        }
    });

    return links;
}

/**
 * NEW: Extracts all image sources and converts them to absolute URLs.
 */
function extractImages($: cheerio.Root, baseUrl: string): string[] {
    const images = new Set<string>();

    $("img").each((_, element) => {
        const src = $(element).attr("src");
        if (src) {
            try {
                // Create an absolute URL. This handles cases like '/img/logo.png'
                const absoluteUrl = new URL(src, baseUrl).href;
                images.add(absoluteUrl);
            } catch (error) {
                // Ignore invalid URLs
                console.warn(`Could not resolve image URL: ${src}`);
            }
        }
    });

    return Array.from(images);
}
