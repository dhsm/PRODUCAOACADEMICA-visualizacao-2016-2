# Produção Acadêmica Cin 2013-2016

![alt tag](Preview-01.png)

## Vistas
* Relacionamento Professor x Professores
* Conexões entre autores (grafo)
* Detalhes sobre os trabalhos acadêmicos (metadados)

## Tecnologias
* D3.js

## Especificações de cada vista
### Relacionamento Professor x Professor
#### Dados
Cada trabalho apresenta os seguintes campos:

| Campo       | Tipo          | Descrição  |
| ------------- |:-------------:| -----:|
| authors     | array | Tipo do autor(discente, docente), nome, index|
| extension     | array      |   Informações extras referente ao trabalho acadêmico |
| ies | String     |    Instituição de Ensino Superior |
| name | String     |    Nome do trabalho |
| program | String     |    Curso |
| researchLine | String     |    Área de pesquisa |
| researchProject | String     |    Projeto de pesquisa onde o trabalho foi desenvolvido |
| year | String     |    Ano em que o trabalho foi desenvolvido |

Este vista utiliza os dados do campo authors e mostra apenas a colaboração entre docentes (professores).


Primeiro todos os autores do dataset são armazenados na variável people[] e classificados de acordo com o papel deles no trabalho (docente, discente, participante externo ou outros).


Em seguida é criada uma matriz com todas as relações entre os autores do dataset, cujo valor é a quantidade de vezes que os dois autores trabalharam juntos (ou seja, a quantidade de trabalhos onde ambos os autores estão presentes).

Por fim as conexões são apresentadas utilizando D3.
