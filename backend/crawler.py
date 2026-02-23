import requests
from bs4 import BeautifulSoup

def fetch_html(url: str, headers: dict = None) -> str:
    """
    Fetch the HTML content of a URL.
    """
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return ""


def parse_html(html: str) -> BeautifulSoup:
    """
    Parse HTML string using BeautifulSoup.
    """
    return BeautifulSoup(html, "lxml")


def extract_content(soup: BeautifulSoup) -> str:
    """
    Extract main text content from a page.
    """
    # Get all paragraphs
    paragraphs = soup.find_all("p")
    text = "\n".join(p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True))
    return text


def scrape_page(url: str, headers: dict = None) -> dict:
    """
    Scrape a web page and return structured output:
    - title
    - meta description
    - headings (h1-h3)
    - all links
    - article content (text)
    """
    html = fetch_html(url, headers)
    if not html:
        return {}

    soup = parse_html(html)

    # Extract title
    title = soup.title.string.strip() if soup.title else None

    # Extract meta description
    meta_desc_tag = soup.find("meta", attrs={"name": "description"})
    meta_description = meta_desc_tag["content"].strip() if meta_desc_tag else None

    # Extract headings
    headings = {}
    for level in range(1, 4):
        headings[f"h{level}"] = [h.get_text(strip=True) for h in soup.find_all(f"h{level}")]

    # Extract all links
    links = [a.get("href") for a in soup.find_all("a", href=True)]

    # Extract page content
    content = extract_content(soup)

    return {
        "url": url,
        "title": title,
        "meta_description": meta_description,
        "headings": headings,
        "links": links,
        "content": content
    }


# Example usage
