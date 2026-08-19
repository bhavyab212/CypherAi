import os, re

HTML_DIR = '/home/prosche/Documents/Projects/Phantom Node/Final-Main/site'

# SVG Icons
TELEGRAM_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>'
THREADS_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" fill="currentColor" style="width:16px;height:16px"><path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0282C19.8819 44.4859 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.972C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.126 166.26 113.892C161.776 103.547 153.266 95.2667 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"/></svg>'

for root, dirs, files in os.walk(HTML_DIR):
    for f in files:
        if f.endswith('.html'):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
            
            new_c = c
            
            # 1. Add contact-modal.css and contact-modal.js if missing
            if 'contact-modal.css' not in new_c:
                new_c = new_c.replace(
                    '<link rel="stylesheet" href="./repeatless-import/antimetal.css">',
                    '<link rel="stylesheet" href="./repeatless-import/antimetal.css">\n    <link rel="stylesheet" href="./repeatless-import/contact-modal.css">'
                )
            if 'contact-modal.js' not in new_c:
                new_c = new_c.replace(
                    '<script src="./repeatless-import/inject.js"></script>',
                    '<script src="./repeatless-import/inject.js"></script>\n    <script src="./repeatless-import/contact-modal.js"></script>'
                )
            
            # 2. Fix linkedin URLs to absolute
            new_c = re.sub(
                r'href=[\"\'](?:https?://)?(?:www\.)?linkedin\.com(?:/in/priyansh-razz-293154372)?[\"\']',
                'href="https://www.linkedin.com/in/priyansh-razz-293154372" target="_blank" rel="noopener noreferrer"',
                new_c
            )
            
            if new_c != c:
                with open(p, 'w', encoding='utf-8') as fp:
                    fp.write(new_c)
                print(f'Updated: {p}')

print('HTML files updated successfully.')
