# Centro Tecnológico UNEDUVALE

Site institucional do Centro Tecnológico UNEDUVALE (Avaré-SP), dedicado ao curso de Análise e Desenvolvimento de Sistemas.

Site estático (HTML, CSS e JavaScript puros), sem build e sem dependências. Basta abrir o `index.html` ou publicar no GitHub Pages.

## Estrutura

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Página inicial: apresentação, institucional, curso, números, depoimentos e notícias |
| `cursos.html` | Curso de ADS: grade curricular e perguntas frequentes |
| `projetos.html` | Projetos dos alunos |
| `agenda.html` | Eventos |
| `docentes.html` | Professores e orientadores |
| `inclusao.html` | Ações de inclusão digital |
| `seguranca.html` | Privacidade, LGPD e boas práticas |
| `vestibular.html` | Informações do vestibular |
| `contato.html` | Telefones, endereços, formulário e mapa |
| `styles.css` | Estilos (tema claro/escuro via variáveis CSS) |
| `app.js` | Tema, menu mobile, abas, animação de entrada e formulário |

## Observações

- O formulário de contato não tem servidor: ele abre o aplicativo de e-mail do visitante com a mensagem pronta para `comercial@eduvaleavare.com.br`.
- Cabeçalho e rodapé se repetem em todas as páginas; ao alterar um item do menu, atualize todos os arquivos `.html`.
