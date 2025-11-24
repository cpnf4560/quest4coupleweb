# -*- coding: utf-8 -*-
import json

# Carregar JSON
with open('data/packs_data_clean.json', 'r', encoding='utf-8') as f:
    packs = json.load(f)

print('='*80)
print('📊 CONTAGEM DE PERGUNTAS POR PACK')
print('='*80)
print()

total_geral = 0

for pack in packs:
    pack_name = pack['name']
    pack_total = 0
    
    print(f"📦 {pack_name}")
    print('-'*80)
    
    for cat in pack['categories']:
        cat_name = cat['name']
        cat_count = len(cat['questions'])
        pack_total += cat_count
        print(f"  • {cat_name}: {cat_count} perguntas")
    
    print(f"  SUBTOTAL: {pack_total} perguntas")
    print()
    
    total_geral += pack_total

print('='*80)
print(f'🎯 TOTAL GERAL: {total_geral} perguntas')
print('='*80)
