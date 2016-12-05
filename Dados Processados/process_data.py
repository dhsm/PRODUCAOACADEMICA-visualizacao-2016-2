import json
import unittest
import numpy

def readJSON(data_url):
    with open('data_with_index.json') as json_data:
        dataset = json.load(json_data)
    return dataset

def getProfessorsNames(json_data):
    authors_dict = []
    for academic_work in json_data:
        for author in academic_work['authors']:
            if author['name'] not in authors_dict:
                if author['category'] == 'Docente':
                    authors_dict.append(author['name'])

    return authors_dict

def getAcademicWorkIDs(dataset, professor_name):
    academic_work_ids = []
    for academic_work in dataset:
        names = [x['name'] for x in academic_work['authors']]
        if professor_name in names:
            academic_work_ids.append(academic_work['index'])

    return academic_work_ids

def getProfessorsWorkedWith(dataset, academic_work_ids, professor_name):
    professors_worked_with = []
    for academic_work_id in academic_work_ids:
        works = [x for x in dataset if (x['index'] in academic_work_ids)]

    professors = getProfessorsNames(works)
    return [x for x in professors if x != professor_name]

def getPeople(json_data):
    people_with_duplicates = []
    for academic_work in json_data:
        for author in academic_work['authors']:
            people_with_duplicates.append(author)

    people_names = []
    people_unique = []
    index = 0
    for person in people_with_duplicates:
        if person['name'] not in people_names:
            people_names.append(person['name'])
            person['ID'] = index
            people_unique.append(person)
            index+=1

    return people_unique

def getProfessors(people):
    return [x for x in people if x['category']=='Docente']

def getCollaboratorsMatrix(dataset,people):
    people_len = len(people)
    matrix = numpy.zeros(shape=(people_len,people_len),dtype='int')
    for academic_work in dataset:
        for author in academic_work['authors']:
            for author2 in academic_work['authors']:
                if author['name'] != author2['name']:
                    person1ID = int([x for x in people if x['name'] == author['name']][0]['ID'])
                    person2ID = int([x for x in people if x['name'] == author2['name']][0]['ID'])
                    matrix[person1ID][person2ID] = matrix[person1ID][person2ID]+1

    return matrix

def getCollaborators(matrix,professors):
    collaborations = []
    for person in professors:
        print(person)
        print(matrix[person['ID']-1,:])
        for idx, val in numpy.ndenumerate(matrix[person['ID']-1,:]):
            a = {}
            if val > 0:
                a['professor1'] = person['ID']
                a['professor2'] = idx[0]+1
                a['quantity_collaborations'] = val
                collaborations.append(a)

    return collaborations

def getDATASET1():
    export = []
    data = readJSON('data_with_index.json')
    names = getProfessorsNames(data)
    print(len(names))
    for name in names:
        a = {}
        a['name'] = name
        a['works'] = getAcademicWorkIDs(data,name)
        a['professors_worked_with'] = getProfessorsWorkedWith(data, a['works'], name)
        export.append(a)

    #print(export)
    print(len(export))
    with open('work_and_collaboration_by_professor.json' ,'w') as nf:
        json.dump(export, nf)

def getDATASET2():
    data = readJSON('data_with_index.json')
    people = getPeople(data)
    professors = getProfessors(people)
    matrix = getCollaboratorsMatrix(data,people)
    export = getCollaborators(matrix,professors)

    with open('quantity_collaborations.json' ,'w') as nf:
        json.dump(export, nf)

def getDATASET3():
    data = readJSON('data_with_index.json')
    people = getPeople(data)
    print(people)



#getDATASET1()
#getDATASET2()
getDATASET3()

class MyTest(unittest.TestCase):
    def testReadJSON(self):
        self.assertEqual(readJSON('data.json')[0]["ies"],"UNIVERSIDADE FEDERAL DE PERNAMBUCO")

    def testGetAuthors(self):
        data = readJSON('data_with_index.json')
        self.assertEqual(getProfessorsNames(data)[0],"JAELSON FREIRE BRELAZ DE CASTRO")

    def testGetAcacemicWorkIDs(self):
        data = readJSON('data_with_index.json')
        self.assertEqual(getAcademicWorkIDs(data, "ALUIZIO FAUSTO RIBEIRO ARAUJO"),[225, 328, 329, 519, 846, 864, 949])

    def testGetProfessorsWorkedWith(self):
        data = readJSON('data_with_index.json')
        academic_work_ids = getAcademicWorkIDs(data, "ALUIZIO FAUSTO RIBEIRO ARAUJO")
        self.assertEqual(getProfessorsWorkedWith(data, academic_work_ids, "ALUIZIO FAUSTO RIBEIRO ARAUJO"),["HANSENCLEVER DE FRANCA BASSANI"])
        academic_work_ids = getAcademicWorkIDs(data, "JAELSON FREIRE BRELAZ DE CASTRO")
        self.assertEqual(getProfessorsWorkedWith(data, academic_work_ids, "JAELSON FREIRE BRELAZ DE CASTRO"),["CARLA TACIANA LIMA LOURENCO SILVA SCHUENEMANN","ROBSON DO NASCIMENTO FIDALGO","SERGIO CASTELO BRANCO SOARES","FERNANDO JOSE CASTOR DE LIMA FILHO","PAULO HENRIQUE MONTEIRO BORBA"])

    def testGetPeople(self):
        data = readJSON('data_with_index.json')
        self.assertEqual(len(getPeople(data)),1543)

    def testGetCollaboratorsMatrix(self):
        data = readJSON('data_with_index.json')
        people = getPeople(data)
        #self.assertEqual(getCollaboratorsMatrix(data,people),"k")

    def testGetCollaborators(self):
        data = readJSON('data_with_index.json')
        people = getPeople(data)
        professors = getProfessors(people)
        matrix = getCollaboratorsMatrix(data,people)
        self.assertEqual(getCollaborators(matrix,professors),[])

    #"ALUIZIO FAUSTO RIBEIRO ARAUJO",546

#if __name__ == '__main__':
    #unittest.main()
