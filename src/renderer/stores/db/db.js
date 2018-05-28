import PouchDB from 'pouchdb-browser'

const db = db || new PouchDB('swagger-dev-changes-detector')

export default db
