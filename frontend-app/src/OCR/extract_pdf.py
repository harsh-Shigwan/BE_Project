import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text("text") + "\n"
    return text


pdf_file = "./sarita.pdf"  # Change to your PDF file
extracted_text = extract_text_from_pdf(pdf_file)
print(extracted_text)
