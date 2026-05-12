import os

MAPPING_DIR = r"C:\Program Files (x86)\Steam\steamapps\common\Grand Theft Auto San Andreas\CLEO\mapping"
INDEX_FILE  = os.path.join(MAPPING_DIR, "index.ini")
EXTENSIONS  = (".ini", ".pwn", ".txt")

converted = []

for filename in os.listdir(MAPPING_DIR):
    if filename.lower() == "index.ini":
        continue
    if not filename.lower().endswith(EXTENSIONS):
        continue

    filepath = os.path.join(MAPPING_DIR, filename)
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        lines = f.readlines()

    entries = [l.strip() for l in lines if l.strip().startswith("CreateObject(")]
    if not entries:
        print(f"  SKIP (no CreateObject): {filename}")
        continue

    with open(filepath, "w", encoding="utf-8") as f:
        f.write("[map]\n")
        for i, entry in enumerate(entries):
            f.write(f"{i}={entry}\n")

    print(f"  OK ({len(entries)} objects): {filename}")
    converted.append(filename)

with open(INDEX_FILE, "w", encoding="utf-8") as f:
    f.write("[files]\n")
    for i, name in enumerate(converted):
        f.write(f"{i}={name}\n")

print(f"\nindex.ini: {len(converted)} file(s) listed.")
input("Press Enter to close...")
