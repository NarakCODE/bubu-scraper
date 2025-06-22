import { scrapeWebsite } from "@/app/libs/scraper";
import { NextRequest, NextResponse } from "next/server";

/**
 * API route handler for scraping a website.
 * Expects a POST request with a JSON body containing a "url" property.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const url = body.url;

        // 1. Validate the URL
        if (!url) {
            return NextResponse.json(
                { error: "URL is required" },
                { status: 400 }
            );
        }

        // A simple regex to check for a valid URL format
        const urlPattern = new RegExp(
            "^(https?:\\/\\/)?" + // protocol
                "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
                "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
                "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
                "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
                "(\\#[-a-z\\d_]*)?$", // fragment locator
            "i"
        );

        if (!urlPattern.test(url)) {
            return NextResponse.json(
                { error: "Invalid URL format provided" },
                { status: 400 }
            );
        }

        // 2. Call our scraping function from the lib
        console.log(`API received request to scrape: ${url}`);
        const data = await scrapeWebsite(url);

        // 3. Return the scraped data
        return NextResponse.json(data);
    } catch (error) {
        // 4. Handle any errors during the process
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Failed to scrape the website." },
            { status: 500 }
        );
    }
}
