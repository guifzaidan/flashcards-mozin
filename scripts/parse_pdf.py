"""
Converte PDF para markdown usando markitdown (Microsoft).
Uso: python scripts/parse_pdf.py <caminho_do_pdf>
Saída: JSON com { "markdown": "...", "error": null }
"""
import sys
import json

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"markdown": "", "error": "Caminho do PDF não informado"}))
        sys.exit(1)

    pdf_path = sys.argv[1]

    try:
        from markitdown import MarkItDown
        md = MarkItDown()
        result = md.convert(pdf_path)
        print(json.dumps({"markdown": result.text_content, "error": None}))
    except ImportError:
        print(json.dumps({
            "markdown": "",
            "error": "markitdown não instalado. Execute: pip install 'markitdown[pdf]'"
        }))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"markdown": "", "error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
