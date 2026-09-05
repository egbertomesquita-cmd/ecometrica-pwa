# Auditoria funcional dos gráficos da EcoMétrica 3.0

Data: 5 de setembro de 2026  
Versão avaliada: 85  
Fuso de referência: America/Fortaleza  
Fonte: backup administrativo exportado em 5 de setembro de 2026, às 16h37, e testes na interface pública autenticada.

## Avaliação geral

**Classificação: necessita revisão antes do uso dos gráficos como resultado definitivo da dissertação.**

Os cálculos centrais foram reproduzidos e a interface apresenta os mesmos totais para os universos testados. A lógica de produção anual, rankings, pares de rede, Bradford, Lotka, Zipf e índice h funciona conforme o código. Entretanto, há problemas de vinculação e qualidade que podem alterar a interpretação, principalmente nas análises espaciais/ecológicas, citações, normalização de entidades e rastreabilidade da deduplicação.

## Universo auditado

- 6 sessões;
- 249 artigos;
- 3 sessões de triagem;
- 129 decisões de triagem;
- 92 decisões de elegibilidade;
- 11 fichas de extração;
- 729 ocorrências GBIF no backup inicial;
- 759 ocorrências exibidas posteriormente na interface, indicando atualização do conjunto durante a auditoria.

Na sessão `Revisão 01/09/2026`, a interface e o recálculo independente coincidiram:

| Universo | Artigos | Autores | Palavras-chave | Citações | Índice h |
|---|---:|---:|---:|---:|---:|
| Deduplicado | 13 | 52 | 85 | 0 | 0 |
| Incluído após elegibilidade | 2 | 4 | 20 | 0 | 0 |

## Resultado por análise

| Gráfico ou indicador | Situação | Evidência e ressalva |
|---|---|---|
| Produção científica anual | Conforme | Contagem direta por ano coincide com os artigos do universo selecionado. |
| Periódicos mais produtivos | Conforme com ressalva | No corpus atual, todos possuem periódico. Pelo código, quando o periódico falta, a base de origem é contada como se fosse periódico. |
| Autores mais produtivos | Conforme com ressalva | As contagens coincidem, mas não há desambiguação. `Orsi, Mario Luis` e `Orsi, Mário Luís`, por exemplo, aparecem como autores diferentes. |
| Palavras-chave mais frequentes | Conforme com ressalva | Frequências coincidem. Sinônimos e traduções, como `água doce` e `freshwater`, permanecem separados. |
| Rede de coautoria | Conforme com ressalva | Os pares são formados por coocorrência no mesmo artigo e a interação é vinculada a mouse, clique e teclado. A prévia limita-se aos 18 nós mais frequentes e 45 arestas, sem informar o corte junto ao gráfico. |
| Rede de palavras-chave | Conforme com ressalva | Pesos dos pares correspondem às coocorrências. Aplicam-se os mesmos limites de 18 nós e 45 arestas e a ausência de normalização temática. |
| Lei de Bradford | Conforme com ressalva | As zonas somam corretamente o universo; são aproximadas e podem ficar desequilibradas em amostras pequenas. |
| Lei de Lotka | Conforme com ressalva | Para os 13 artigos: 52 autores, 51 com um artigo e 1 com dois. O expoente é regressão descritiva sobre classes observadas, não teste de aderência nem estimação robusta. |
| Lei de Zipf | Conforme com ressalva | Para os 13 artigos: 85 termos, 96 ocorrências e 77 termos únicos. A análise usa palavras-chave, não o texto integral; em universo uniforme, a interface pode exibir `-0`. |
| Citações e índice h | Divergente para interpretação científica | O cálculo de h está correto para os valores armazenados, mas todos os 249 artigos possuem `citationCount = 0`. O sistema não distingue “zero citações” de “contagem não fornecida”. |
| Instituições e países | Conforme com dados insuficientes | A sessão testada mostra cobertura de 0%, coerente com a ausência de afiliações. Não há base para resultados institucionais ou geográficos. |
| Evolução temática | Conforme com ressalva | Os três períodos e as frequências coincidem. Com apenas dois artigos no universo final, classificar termos como emergentes ou em declínio é tecnicamente calculável, mas cientificamente frágil. |
| Análises espaciais/ecológicas | Divergente | Todas as ocorrências GBIF estão sem `projectId` e o código agrega todas as ocorrências do usuário, independentemente da sessão/projeto. Há ainda frases comuns classificadas automaticamente como espécies. |
| Exportações analíticas | Conforme com ressalva | CSVs, BibTeX, GeoJSON e arquivos VOSviewer foram gerados e abertos estruturalmente. O GeoJSON reproduz a contaminação global do GBIF; não havia coordenada de estudo válida no universo final testado. |

## Problemas priorizados

1. **Alta — ocorrências GBIF sem vínculo:** 729/729 ocorrências do backup não possuem projeto; a interface chegou a 759 durante a auditoria. Isso contamina análises espaciais e exportações QGIS de qualquer sessão.
2. **Alta — espécies extraídas incorretamente:** o painel apresenta expressões como `The aim`, `The search` e `Brazilian waters` como espécies. O pré-preenchimento automático precisa de validação taxonômica e as fichas automáticas não deveriam entrar como evidência revisada.
3. **Alta — citações não informativas:** todos os artigos têm valor zero, mas a interface os trata como contagens válidas. Índice h, médias e ranking de impacto não devem ser usados até distinguir valor ausente de zero confirmado.
4. **Média — integridade referencial:** há 1 decisão de triagem, 1 decisão de elegibilidade e 3 fichas de extração apontando para artigos inexistentes.
5. **Média — sessão inconsistente:** `Revisão 04/09/2026` declara 15 registros, mas somente 12 artigos existem na coleção.
6. **Média — sessões sem projeto:** 0/6 sessões e 0/249 artigos possuem `projectId`; apenas 1/3 triagens possui essa vinculação. Isso dificulta separar estudos de projetos diferentes.
7. **Média — deduplicação não reprodutível:** cinco sessões aparecem como deduplicação concluída, mas não há registros em `deduplicationAudits` no backup.
8. **Média — normalização insuficiente:** variações de grafia, acentuação, idioma e abreviação fragmentam autores, palavras-chave, instituições, países e localidades (`Paraná` e `ParanÃ¡`).
9. **Baixa — cortes das redes não explicitados:** a prévia mostra no máximo 18 nós e 45 arestas, embora a exportação possa conter universo maior.

## Testes da interface

- Carregamento do módulo Resultados: aprovado.
- Alternância por URL entre corpus deduplicado e corpus final: aprovada; totais mudaram de 13 para 2 e coincidiram com o recálculo.
- Renderização de todos os 13 blocos analíticos: aprovada.
- Ligações de interação das redes: presentes para `pointerenter`, `pointerleave`, foco, clique, Enter e espaço; estilos de destaque estão definidos.
- Exportações Lotka, Zipf, impacto, institucional, temporal, espacial, bibliometrix, QGIS e VOSviewer: arquivos gerados.
- QGIS: GeoJSON válido em CRS84, com 729 feições GBIF e nenhuma coordenada de artigo no teste do corpus final.
- Impressão geral: botão presente; a validação de paginação física não foi concluída nesta rodada.

## Requisitos antes de usar na dissertação

1. Vincular sessão, artigo, extração e ocorrência GBIF ao mesmo projeto e filtrar todas as análises por esse vínculo.
2. Excluir rascunhos automáticos das análises ecológicas até revisão humana e validar nomes científicos.
3. Representar citações ausentes como `null`/“não informado”, separadas de zero.
4. Executar limpeza de órfãos e recalcular `articleCount` a partir dos artigos existentes.
5. Implementar tabela de equivalências para autores, termos, instituições e localidades.
6. Exibir os cortes das redes e impedir interpretações de Lotka, Zipf e evolução temática abaixo de um tamanho mínimo definido metodologicamente.
7. Comparar um corpus fechado com bibliometrix e VOSviewer após as correções.

## Limitações desta auditoria

- A auditoria verificou funcionamento, agregações e consistência interna; não avaliou a interpretação ecológica dos resultados.
- Os dados mudaram durante o teste por sincronização/uso ativo; por isso, números devem ser lidos com a data e hora da extração.
- Não foi possível confirmar externamente citações porque o corpus importado não contém contagens diferentes de zero.

## Reprodutibilidade

O script usado nos recálculos está em `audit/graph-audit.js` e recebe como argumento um backup JSON exportado pela área administrativa. O backup contém dados de pesquisa e não foi copiado para o repositório.
