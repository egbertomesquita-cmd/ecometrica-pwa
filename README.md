# EcoMétrica PWA

Aplicação web progressiva independente, criada a partir da especificação da EcoMétrica 3.0.

## Executar

Na pasta do projeto:

```bash
python3 -m http.server 4173
```

Abra `http://localhost:4173`. O uso por servidor local é necessário para o service worker e a instalação como PWA.

## Acesso de demonstração

- E-mail: `pesquisador@uern.br`
- Senha: `ecometrica`

Os dados ficam armazenados no navegador. Use **Administração → Exportar backup** para guardar uma cópia e **Importar backup** para restaurá-la.

## Recursos

- Construtor booleano para sete bases científicas;
- importação CSV, RIS e BibTeX, com detecção de duplicatas;
- sessões, métricas cienciométricas e exportações;
- triagem, elegibilidade e fluxo PRISMA;
- busca de ocorrências na API pública do GBIF;
- exportação para VOSviewer;
- funcionamento offline após o primeiro carregamento.
