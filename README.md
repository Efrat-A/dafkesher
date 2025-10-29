# dafkesher
prepare daf kesher using google forms and macro action
*macro action = Google Apps Script

### Create a google FORM

Set the following fields:
- name
- parents
- phone number
- address
- picture 1G /or other limitation.. depend on the quality you wish

optional: process the photos - crop the pictures to face square to show face in zoom, its manually at the moment.
### ⭐ Get responses - goto the responses xml

### ⭐ Apps script: run the gs script
1. Open from google sheet:  `תוספים -> Apps Script`

2. Paste `grid.gs`

3. Quick validate colums indexes are matching intention (name in col1, address in 7 and so on)

4. Run

---
troubleshoot:

update the grid.gs script according to the table, columns indexes, *mind the commas`,` if you edit*.

check that table present the image name (ticker and not the full path or link)

---

### ⭐  HTML created successfully
script finished: - go to the link it created in the console logs, copy the text /(download) and paste into text file named contacts.html

### ⭐ Download the pictures
collected from the form responses, store them in folder called pics
(important the contacts.html and pics will live in the same directory)

### ⭐ create PDF
 You Can now open the .html that the macro created,
    print, but instead of printing to printer you can save it as PDF,
    i recommend scale to 130.

---
### OPTIONAL: STAND ALONE HTML

the `main.py` script is if you want to HASH the images so the page won't need the pics folder
if its going to be sent/published as html.

input for main.py:
```
contacts.html
pics/
```
output:
```
contacts2.html
```
---
Run:
```
python3 main.py
```

```
proj_kesher
../
├── contacts.html
├── README.md
├── grid.gs
├── main.py
├── pics
│   ├── 20250901_0001 - Israel Israeli.jpg
```
