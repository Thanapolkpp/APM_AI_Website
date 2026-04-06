import io

try:
    import fitz  # pymupdf
    PYMUPDF_AVAILABLE = True
except ImportError:
    PYMUPDF_AVAILABLE = False


def compress_pdf(file_bytes: bytes) -> bytes:
    """
    บีบอัด PDF 2 ชั้น:
      ชั้น 1 — garbage collection + deflate (ปลอดภัย, ยังอ่านข้อความได้)
      ชั้น 2 — recompress รูปภาพใน PDF ด้วย JPEG quality 65
    คืน bytes ที่เล็กลง หรือ bytes เดิมถ้า pymupdf ไม่พร้อมใช้งาน
    """
    if not PYMUPDF_AVAILABLE:
        return file_bytes

    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")

        # ชั้น 2 — บีบรูปภาพในแต่ละหน้า
        for page in doc:
            for img_info in page.get_images(full=True):
                xref = img_info[0]
                try:
                    base = doc.extract_image(xref)
                    if base["ext"] not in ("jpeg", "jpg", "png"):
                        continue

                    # render รูปภาพใหม่ที่ quality ต่ำลง ผ่าน pixmap
                    pix = fitz.Pixmap(doc, xref)
                    if pix.n > 3:
                        # แปลง CMYK/Alpha → RGB ก่อน
                        pix = fitz.Pixmap(fitz.csRGB, pix)

                    compressed = pix.tobytes("jpeg", jpg_quality=65)
                    doc.update_stream(xref, compressed)
                except Exception:
                    # ถ้ารูปไหน compress ไม่ได้ ข้ามไป ไม่ให้ crash
                    continue

        # ชั้น 1 — garbage=4 ลบ object ที่ไม่ใช้, deflate=True บีบ stream
        output = io.BytesIO()
        doc.save(output, garbage=4, deflate=True, clean=True)
        doc.close()
        return output.getvalue()

    except Exception:
        # ถ้า compress ล้มเหลวทั้งหมด ส่ง bytes เดิมกลับไป
        return file_bytes


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    ดึงข้อความจาก PDF ใช้ pymupdf ถ้ามี, fallback ใช้ PyPDF2
    """
    if PYMUPDF_AVAILABLE:
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            texts = [page.get_text() for page in doc]
            doc.close()
            return "\n".join(t for t in texts if t.strip())
        except Exception:
            pass

    # fallback PyPDF2
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        pages_text = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                pages_text.append(text)
        return "\n".join(pages_text)
    except Exception:
        return ""
