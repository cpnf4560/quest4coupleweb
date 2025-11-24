# -*- coding: utf-8 -*-
"""
AUDITORIA COMPLETA - packs_data_clean.json
Detecta: duplicados, similares, erros ortográficos, inconsistências
"""

import json
import re
from collections import defaultdict, Counter
from difflib import SequenceMatcher

def similarity(a, b):
    """Calcula similaridade entre duas strings (0-1)"""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def carregar_json():
    """Carrega o ficheiro JSON"""
    with open('data/packs_data_clean.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def estatisticas_gerais(packs):
    """Retorna estatísticas gerais e mapa de perguntas"""
    print('='*80)
    print('🔍 AUDITORIA COMPLETA - packs_data_clean.json')
    print('='*80)
    print()
    print('📊 ESTATÍSTICAS GERAIS:')
    print('-'*80)
    
    total_perguntas = 0
    all_questions = []
    question_map = defaultdict(list)
    
    for pack in packs:
        pack_name = pack['name']
        pack_count = 0
        
        for cat in pack['categories']:
            cat_name = cat['name']
            questions = cat['questions']
            pack_count += len(questions)
            
            for q in questions:
                q_clean = q.strip()
                all_questions.append(q_clean)
                question_map[q_clean].append((pack_name, cat_name))
        
        total_perguntas += pack_count
        print(f'  {pack_name}: {pack_count} perguntas')
    
    print(f'\n  TOTAL GERAL: {total_perguntas} perguntas')
    print()
    
    return all_questions, question_map

def encontrar_duplicados(question_map):
    """Encontra perguntas 100% duplicadas"""
    print('❌ PERGUNTAS DUPLICADAS (EXATAS):')
    print('-'*80)
    
    duplicates = {q: locs for q, locs in question_map.items() if len(locs) > 1}
    
    if duplicates:
        print(f'  ENCONTRADAS {len(duplicates)} PERGUNTAS DUPLICADAS!\n')
        for q, locations in sorted(duplicates.items()):
            print(f'  Pergunta: "{q}"')
            for pack, cat in locations:
                print(f'    → {pack} / {cat}')
            print()
        return len(duplicates)
    else:
        print('  ✅ Nenhuma pergunta duplicada encontrada!')
        print()
        return 0

def encontrar_similares(all_questions):
    """Encontra perguntas muito similares (>80%)"""
    print('⚠️  PERGUNTAS MUITO SIMILARES (>80%):')
    print('-'*80)
    
    similar_pairs = []
    checked = set()
    
    # Verificar todas as perguntas
    total = len(all_questions)
    print(f'  Analisando {total} perguntas...')
    
    for i, q1 in enumerate(all_questions):
        if i % 50 == 0:
            print(f'  Progresso: {i}/{total}', end='\r')
        
        for j in range(i+1, total):
            q2 = all_questions[j]
            
            pair = tuple(sorted([q1, q2]))
            if pair in checked:
                continue
            checked.add(pair)
            
            sim = similarity(q1, q2)
            if 0.80 < sim < 1.0:
                similar_pairs.append((sim, q1, q2))
    
    print()
    
    if similar_pairs:
        print(f'\n  ENCONTRADOS {len(similar_pairs)} PARES SIMILARES!\n')
        for sim, q1, q2 in sorted(similar_pairs, key=lambda x: -x[0])[:15]:
            print(f'  Similaridade: {sim:.1%}')
            print(f'    1: "{q1}"')
            print(f'    2: "{q2}"')
            print()
        return len(similar_pairs)
    else:
        print('  ✅ Nenhuma pergunta muito similar encontrada!')
        print()
        return 0

def encontrar_erros(all_questions):
    """Encontra erros ortográficos e de formatação"""
    print('🔤 POSSÍVEIS ERROS ORTOGRÁFICOS/FORMATAÇÃO:')
    print('-'*80)
    
    errors = []
    
    for q in all_questions:
        # Espaços duplos
        if '  ' in q:
            errors.append(('Espaço duplo', q))
        
        # Falta ponto final
        if not q.endswith(('.', '?', '!', ')', ':')) and len(q) > 10:
            errors.append(('Sem pontuação final', q))
        
        # Maiúscula no meio (exceto siglas/nomes)
        words = q.split()
        for i, word in enumerate(words):
            if i > 0 and len(word) > 3 and word[0].isupper() and not word.isupper():
                # Exceções: nomes próprios, siglas
                if word not in ['Reddit', 'Yoni', 'Lingham', 'Kamasutra', 'Unicorn', 'Hunting', 'Findom', 'Sugar', 'Daddy', 'Mummy', 'Dogging', 'Ativo', 'FFM', 'MMF', 'Swing', 'Soft', 'Hard']:
                    errors.append(('Maiúscula suspeita', q))
                    break
        
        # Ponto final duplicado
        if q.endswith('..') and not q.endswith('...'):
            errors.append(('Ponto final duplicado', q))
        
        # Vírgula antes de ponto
        if ',.' in q:
            errors.append(('Vírgula antes de ponto', q))
    
    if errors:
        error_types = Counter([e[0] for e in errors])
        print(f'  ENCONTRADOS {len(errors)} POSSÍVEIS ERROS!\n')
        
        for error_type, count in error_types.most_common():
            print(f'  {error_type}: {count} ocorrências')
            examples = [e[1] for e in errors if e[0] == error_type][:5]
            for ex in examples:
                print(f'    → "{ex}"')
            print()
        return len(errors)
    else:
        print('  ✅ Nenhum erro óbvio encontrado!')
        print()
        return 0

def verificar_consistencia(all_questions):
    """Verifica consistência de tom (tu/você)"""
    print('🎭 CONSISTÊNCIA DE TOM (tu vs você vs outros):')
    print('-'*80)
    
    tu_count = 0
    voce_count = 0
    
    for q in all_questions:
        q_lower = q.lower()
        if ' tu ' in q_lower or q_lower.startswith('tu '):
            tu_count += 1
        if 'você' in q_lower or 'vocês' in q_lower:
            voce_count += 1
    
    print(f'  Perguntas com "tu": {tu_count}')
    print(f'  Perguntas com "você": {voce_count}')
    print(f'  Total de perguntas: {len(all_questions)}')
    print(f'  Sem tratamento direto: {len(all_questions) - tu_count - voce_count}')
    print()
    
    return tu_count, voce_count

def gerar_relatorio(packs):
    """Gera relatório completo"""
    all_questions, question_map = estatisticas_gerais(packs)
    
    duplicados = encontrar_duplicados(question_map)
    similares = encontrar_similares(all_questions)
    erros = encontrar_erros(all_questions)
    tu_count, voce_count = verificar_consistencia(all_questions)
    
    print('='*80)
    print('✅ RESUMO DA AUDITORIA:')
    print('='*80)
    print(f'  Total de perguntas: {len(all_questions)}')
    print(f'  Perguntas duplicadas (exatas): {duplicados}')
    print(f'  Perguntas similares (>80%): {similares}')
    print(f'  Possíveis erros: {erros}')
    print(f'  Tom "tu": {tu_count} | Tom "você": {voce_count}')
    print()
    
    if duplicados > 0 or similares > 0 or erros > 0:
        print('  ⚠️  RECOMENDAÇÃO: Corrigir antes de traduzir!')
    else:
        print('  ✅ CONTEÚDO PRONTO PARA TRADUÇÃO!')
    print('='*80)

if __name__ == '__main__':
    packs = carregar_json()
    gerar_relatorio(packs)
