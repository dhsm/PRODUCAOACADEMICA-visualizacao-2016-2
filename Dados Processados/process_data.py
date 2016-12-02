import json
import unittest

def readJSON(data_url):
    with open('data.json') as json_data:
        dataset = json.load(json_data)
    return dataset

def getProfessors(json_data):
    authors_dict = []
    for academy_work in json_data:
        for author in academy_work['authors']:
            if author['name'] not in authors_dict:
                if author['category'] == 'Docente':
                    authors_dict.append(author['name'])

    return authors_dict
    
class MyTest(unittest.TestCase):
    def testReadJSON(self):
        self.assertEqual(readJSON('data.json')[0]["ies"],"UNIVERSIDADE FEDERAL DE PERNAMBUCO")

    def testGetAuthors(self):
        data = readJSON('data.json')
        self.assertEqual(getProfessors(data)[0],"JAELSON FREIRE BRELAZ DE CASTRO")


if __name__ == '__main__':
    unittest.main()
