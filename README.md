<p align="center">
  <h1 align="center">Copywriting MCP Server</h1>
  <p align="center">
    <strong>MCP Server com 10 ferramentas de validacao para Direct Response copywriting</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/MCP-compatible-purple" alt="MCP">
    <img src="https://img.shields.io/badge/SQLite-embedded-blue" alt="SQLite">
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  </p>
</p>

---

## O que e

Servidor MCP (Model Context Protocol) que fornece 10 ferramentas de validacao de qualidade para copywriting Direct Response. Usado pelo Copy Chief BLACK para enforcar quality gates automaticamente.

### Instalacao

```bash
npx @lucapimenta/copywriting-mcp install
```

## Ferramentas MCP

| Ferramenta | Descricao |
|------------|-----------|
| `validate_gate` | Avanca fase do pipeline (Research → Briefing → Production → Delivery) |
| `blind_critic` | Critica cega — avalia copy sem saber o contexto/oferta |
| `emotional_stress_test` | Testa intensidade emocional e calibragem DRE |
| `black_validation` | Validacao final BLACK (pre-delivery) |
| `semantic_memory_search` | Busca semantica em swipe files e referencias |
| `layered_review` | Review em 5 camadas (estrutura, emocao, logica, CTA, compliance) |
| `voc_search` | Busca em base de VOC (Voice of Customer) |
| `get_phase_context` | Retorna contexto da fase atual do pipeline |
| `create_mecanismo` | Cria/valida Mecanismo Unico (MUP + MUS) |
| `get_mecanismo` | Recupera mecanismo ativo de uma oferta |

## Como Funciona

```
Claude Code → MCP Protocol → Copywriting Server → SQLite + Embeddings
                                    ↓
                              10 Quality Tools
                                    ↓
                           Validation Results → Claude
```

O servidor:
1. Recebe chamadas via MCP protocol
2. Consulta SQLite para estado de ofertas, gates, mecanismos
3. Usa embeddings para busca semantica em swipes/VOC
4. Retorna resultados estruturados para o Claude

## Arquitetura

```
~/.claude/plugins/copywriting-mcp/
  src/
    server.js               Entry point do MCP server
    tools/                  10 ferramentas
      validate-gate.js
      blind-critic.js
      emotional-stress-test.js
      black-validation.js
      semantic-memory-search.js
      layered-review.js
      voc-search.js
      phase-context.js
      create-mecanismo.js
      get-mecanismo.js
    db/
      sqlite.js             Database manager
      embeddings.js          Embedding generator
      schema.sql             Database schema
  prompts/
    blind-critic.md         Prompt de critica cega
    stress-test.md          Prompt de estresse emocional
    black-validation.md     Prompt de validacao BLACK
  data/
    copywriting.db          SQLite database (gerado)
```

## Instalacao Manual

```bash
# 1. Clone
git clone https://github.com/lckx777/copywriting-mcp.git
cd copywriting-mcp

# 2. Instale
node bin/cli.js install
# Copia server/ para ~/.claude/plugins/copywriting-mcp/
# Roda npm install
# Atualiza mcp.json

# 3. Ou instale via npx
npx @lucapimenta/copywriting-mcp install

# 4. Listar ferramentas
npx @lucapimenta/copywriting-mcp tools
```

## Configuracao

O installer adiciona automaticamente ao `~/.claude/mcp.json`:

```json
{
  "mcpServers": {
    "copywriting": {
      "command": "node",
      "args": ["~/.claude/plugins/copywriting-mcp/src/server.js"],
      "env": {
        "COPYWRITING_ECOSYSTEM": "~/copywriting-ecosystem"
      }
    }
  }
}
```

## Requisitos

- Node.js >= 18
- Copy Chief BLACK v2.0+ instalado (`npx @lucapimenta/copy-chief-black install`)
- Claude Code com suporte a MCP

## Pacotes Relacionados

| Pacote | Descricao |
|--------|-----------|
| [`@lucapimenta/copy-chief-black`](https://github.com/lckx777/copy-chief-black) | Core framework (obrigatorio) |
| [`@lucapimenta/copy-chief-dashboard`](https://github.com/lckx777/copy-chief-dashboard) | Dashboard Next.js (opcional) |

## Licenca

MIT — [LICENSE](./LICENSE)
