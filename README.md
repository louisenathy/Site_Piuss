# PIUSS SOCIAL MEDIA AI — Arquitetura do Funcionário Virtual

Bem-vindo à base operacional e de inteligência do **PIUSS SOCIAL MEDIA AI**.

Este projeto abriga a infraestrutura de conhecimento, planejamento, execução e mensuração do **Funcionário Virtual especialista em Social Media, Growth Marketing e Geração de Leads para o Piuss**.

---

## 1. Visão Geral da Arquitetura

O sistema é construído inteiramente em uma arquitetura modular de arquivos Markdown (`.md`), projetados para serem:
* **Fáceis de ler e editar por humanos**;
* **Estruturados para consulta rápida e precisa por agentes de IA**;
* **Livres de dependências externas ou integrações complexas nesta fase inicial**.

```text
PIUSS-SOCIAL-MEDIA-AI/
│
├── README.md                          # Guia mestre da arquitetura e operação do projeto
├── AGENT_RULES.md                     # Regras permanentes e diretrizes inegociáveis do agente
├── prospects.csv                      # Base mapeada de contas e empresas prioritárias em SP
│
├── 00_TEAM/                           # Estrutura e Governança da Equipe
│   ├── equipe.md                      # Matriz de liderança, papéis (Nathy, Luisa, Mariana, Léo, Iara)
│   └── mariana.md                     # Manual operacional de Mariana (Vendas B2B & Outbound)
│
├── 01_BRAND/                          # Identidade de Marca, Ofertas e Públicos
├── 02_STRATEGY/                       # Estratégia de Canais e Pilares de Conteúdo
├── 03_PLANNING/                       # Calendário Semanal e Briefings de Produção
├── 04_ANALYTICS/                      # Histórico de Performance e Auditoria dos 5 Baldes
├── 05_WORKFLOWS/                      # Procedimentos Operacionais Padrão (SOPs)
│   ├── analise-semanal.md             # Análise semanal de métricas
│   ├── criacao-conteudo.md            # Esteira de criação de conteúdo
│   ├── formato-padrao-entregas.md     # Template obrigatório de comunicação com Nathy
│   ├── inteligencia-externa.md        # SOP de pesquisa de mercado e concorrentes
│   ├── planejamento-semanal.md        # SOP de planejamento semanal de growth
│   ├── producao-pecas-semanais.md     # Produção de peças para criativos
│   └── prospeccao-b2b.md              # SOP da Operação Comercial B2B & Outbound de Mariana
│
├── 06_DESIGN/                         # Design System Oficial e Diretrizes Visuais
├── knowledge/                         # Base legada de conhecimento estratégico
├── planning/                          # Base legada de planejamento e backlog
├── workflows/                         # Base legada de frameworks e táticas
└── analytics/                         # Base legada de métricas e templates
```

---

## 2. Divisão Modular dos Diretórios

### 📁 `knowledge/` — O Cérebro Estratégico
Armazena a verdade institucional do Piuss. Nenhuma copy ou estratégia deve contradizer o que está registrado aqui.
* `brand-identity.md`: Define quem a marca é, seu tom de voz e como ela se comunica.
* `audience.md`: Detalha quem compramos o direito de ajudar (dores, desejos e objeções).
* `positioning.md`: Define a proposta única de valor e o que diferencia o Piuss de qualquer alternativa.
* `strategy.md`: Desenha a jornada de aquisição e o funil de atração e geração de leads.
* `content-pillars.md`: Define a distribuição temática para manter o perfil relevante e diversificado.

### 📁 `planning/` — A Esteira de Produção
Organiza o fluxo contínuo de publicação para garantir consistência e cadência.
* `calendar.md`: Grade semanal e mensal, horários recomendados e status de produção.
* `ideas-bank.md`: Repositório vivo de ideias categorizadas por funil e pilar.

### 📁 `workflows/` — Os Procedimentos Operacionais Padrão (SOPs)
Garante qualidade uniforme e repetível, independentemente de quem estiver operando.
* `content-creation.md`: Roteiro de validação da ideia até o post pronto.
* `copywriting-frameworks.md`: Fórmulas comprovadas de conversão e retenção.
* `lead-generation-tactics.md`: Mecanismos de conversão de leitores em oportunidades comerciais.

### 📁 `analytics/` — A Bússola de Dados
Garante foco em métricas de negócio (leads, autoridade, crescimento qualificado).
* `metrics-kpis.md`: Parâmetros claros de sucesso e metas.
* `reports/`: Histórico de aprendizados e evolução das métricas.

---

## 3. Como Operar com o Agente Virtual

O agente atua consultando os arquivos deste repositório antes de gerar respostas. Você pode solicitar tarefas como:

1. **Ideação**:
   > *"Com base no pilar de Autoridade e nas dores do nosso ICP em `knowledge/audience.md`, gere 5 ideias para o LinkedIn com ganchos fortes."*
2. **Redação de Conteúdo**:
   > *"Redija um post em carrossel usando o framework PAS de `workflows/copywriting-frameworks.md` para o pilar de Educação."*
3. **Campanha de Geração de Leads**:
   > *"Crie um roteiro de post no Instagram focado em atração de leads via DM conforme `workflows/lead-generation-tactics.md`."*
4. **Análise de Performance**:
   > *"Preencha o relatório semanal com base nos dados obtidos e aponte os desvios segundo `analytics/metrics-kpis.md`."*

---

## 4. Próximos Passos (Checklist de Ativação)

Antes de iniciar as publicações diárias, preencha os arquivos em `knowledge/` substituindo os marcadores `[A PREENCHER: ...]` pelas informações reais do negócio Piuss.
