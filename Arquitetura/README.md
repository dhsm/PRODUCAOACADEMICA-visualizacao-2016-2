# Produção Acadêmica Cin 2013-2016

![alt tag](Preview-01.png)

## Vistas
* Relacionamento Professor x Professores
* Conexões entre autores (grafo)
* Trabalhos acadêmicos (metadados)

## Tecnologias
* D3.js

## Especificações sobre cada vista
### Relacionamento Professor x Professor
![alt tag](edges.png)
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

Este vista utiliza os dados do campo *authors* e mostra apenas a colaboração entre docentes (professores).


Primeiro todos os autores do dataset são armazenados na variável people[] e classificados de acordo com o papel deles no trabalho (docente, discente, participante externo ou outros).


Em seguida é criada uma matriz com todas as relações entre os autores do dataset, cujo valor é a quantidade de vezes que os dois autores trabalharam juntos (ou seja, a quantidade de trabalhos onde ambos os autores estão presentes).

Por fim as conexões são apresentadas utilizando D3.

### Conexões entre autores (grafo)
![alt tag](graph.png)
#### Dados
Esta vista também utililza apenas os dados do campo *authors*. A dinâmica é a mesma, só que agora utilizamos todos os tipos de autores (docentes, discentes, colaboradores externos e outros).

### Trabalhos acadêmicos (metadados)
#### Dados

Esta vista utiliza o array de metadados sobre os trabalhos (campo *extension*) e mostra para o usuário através de um bubble graph com os trabalhos.
