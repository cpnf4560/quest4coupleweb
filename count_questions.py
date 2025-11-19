import json

with open('data/packs_data_clean.json', encoding='utf-8') as f:
    data = json.load(f)

print("=" * 60)
print("CONTAGEM DE PERGUNTAS POR PACK")
print("=" * 60)

total = 0
for pack in data:
    count = sum(len(cat['questions']) for cat in pack['categories'])
    total += count
    print(f"{pack['emoji']} {pack['name']}: {count} perguntas")
    
    for cat in pack['categories']:
        print(f"   - {cat['name']}: {len(cat['questions'])} perguntas")

print("=" * 60)
print(f"TOTAL GERAL: {total} perguntas")
print("=" * 60)
