import requests
from bs4 import BeautifulSoup
import json
import csv
import time

# List of URLs to scrape
urls = [
    "https://www.plan-alytics-demo.com/dashboard",
    "https://www.plan-alytics-demo.com/dashboard/revenue",
    "https://www.plan-alytics-demo.com/dashboard/retention",
    "https://www.plan-alytics-demo.com/dashboard/crm",
    "https://www.plan-alytics-demo.com/dashboard/usage",
    "https://www.plan-alytics-demo.com/dashboard/clv"
]

def scrape_page(url):
    """Scrape a single page and return its inventory"""
    print(f"Scraping: {url}")
    
    try:
        # Fetch the page
        response = requests.get(url)
        response.raise_for_status()
        
        # Parse HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract page title
        page_title = soup.find('title').get_text() if soup.find('title') else "No title"
        
        # Extract all headings
        headings = []
        for i in range(1, 7):  # h1 to h6
            for heading in soup.find_all(f'h{i}'):
                headings.append({
                    'level': f'h{i}',
                    'text': heading.get_text().strip(),
                    'id': heading.get('id', '')
                })
        
        # Extract tabs (specific to your site structure)
        tabs = []
        # Look for TabsTrigger components
        tab_elements = soup.select('[data-state], [role="tab"], .tab, .nav-item, .nav-link')
        for tab in tab_elements:
            tab_text = tab.get_text().strip()
            if tab_text and len(tab_text) > 1:  # Filter out empty/very short texts
                tabs.append({
                    'text': tab_text,
                    'href': tab.get('href', ''),
                    'class': ' '.join(tab.get('class', [])) if tab.get('class') else '',
                    'data_state': tab.get('data-state', '')
                })
        
        # Extract cards (specific to your site structure)
        cards = []
        # Look for Card components
        card_elements = soup.select('.card, [class*="card"], .border-l-4')
        for card in card_elements:
            # Try to find card title
            title_element = card.select_one('h4, h3, h2, .font-medium, .font-bold, .text-sm')
            title = title_element.get_text().strip() if title_element else "Untitled Card"
            
            # Try to find card content
            content_element = card.select_one('p, .text-muted-foreground, .text-xs')
            content = content_element.get_text().strip() if content_element else ""
            
            # Look for specific card patterns from your TSX
            if "border-l-4" in card.get('class', []):
                # This is likely one of your metric cards
                border_color = ""
                if "border-l-green-500" in card.get('class', []):
                    border_color = "green"
                elif "border-l-blue-500" in card.get('class', []):
                    border_color = "blue"
                elif "border-l-purple-500" in card.get('class', []):
                    border_color = "purple"
                elif "border-l-red-500" in card.get('class', []):
                    border_color = "red"
                
                cards.append({
                    'type': 'metric_card',
                    'title': title,
                    'content': content,
                    'border_color': border_color,
                    'classes': ' '.join(card.get('class', []))
                })
            else:
                # Regular card
                cards.append({
                    'type': 'card',
                    'title': title,
                    'content': content,
                    'classes': ' '.join(card.get('class', []))
                })
        
        # Extract charts (specific to Recharts)
        charts = []
        chart_containers = soup.select('.recharts-wrapper, canvas, svg, [class*="chart"]')
        for chart in chart_containers:
            # Try to find a title nearby
            title = None
            parent = chart.find_parent()
            if parent:
                # Look for chart titles in parent elements
                possible_titles = parent.select('h2, h3, h4, .font-bold, .text-lg, .text-xl')
                if possible_titles:
                    title = possible_titles[0].get_text().strip()
            
            charts.append({
                'type': 'chart',
                'title': title,
                'element_type': chart.name,
                'classes': ' '.join(chart.get('class', []))
            })
        
        return {
            'url': url,
            'page_title': page_title,
            'headings': headings,
            'tabs': tabs,
            'cards': cards,
            'charts': charts,
            'status': 'success'
        }
        
    except Exception as e:
        print(f"Error scraping {url}: {str(e)}")
        return {
            'url': url,
            'error': str(e),
            'status': 'failed'
        }

def main():
    """Main function to scrape all pages and export results"""
    all_data = []
    
    # Scrape each page with a delay to be respectful
    for url in urls:
        page_data = scrape_page(url)
        all_data.append(page_data)
        time.sleep(1)  # Be polite with delays between requests
    
    # Export to JSON
    with open('page_inventory_enhanced.json', 'w', encoding='utf-8') as f:
        json.dump(all_data, f, indent=2, ensure_ascii=False)
    
    # Export to CSV (flattened for easier analysis)
    with open('page_inventory_enhanced.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['URL', 'Page Title', 'Element Type', 'Element Name', 'Element Content', 'Additional Info'])
        
        for page in all_data:
            if page['status'] == 'success':
                # Add headings
                for heading in page['headings']:
                    writer.writerow([
                        page['url'],
                        page['page_title'],
                        'Heading',
                        heading['level'],
                        heading['text'],
                        f"ID: {heading['id']}"
                    ])
                
                # Add tabs
                for tab in page['tabs']:
                    writer.writerow([
                        page['url'],
                        page['page_title'],
                        'Tab',
                        tab['text'],
                        '',
                        f"Href: {tab['href']}, Classes: {tab['class']}, State: {tab['data_state']}"
                    ])
                
                # Add cards
                for card in page['cards']:
                    writer.writerow([
                        page['url'],
                        page['page_title'],
                        card['type'],
                        card['title'],
                        card['content'],
                        f"Border: {card.get('border_color', 'none')}, Classes: {card['classes']}"
                    ])
                
                # Add charts
                for chart in page['charts']:
                    writer.writerow([
                        page['url'],
                        page['page_title'],
                        'Chart/Graph',
                        chart['title'] or 'Untitled Chart',
                        '',
                        f"Element: {chart['element_type']}, Classes: {chart['classes']}"
                    ])
    
    print("Enhanced scraping complete! Data saved to page_inventory_enhanced.json and page_inventory_enhanced.csv")

if __name__ == "__main__":
    main()