import {docSortComparator} from "../../utils/db-helper"
import {getNewID} from "../../utils/num-helper"
import db from "../db/db"
import {SCHEME, SCHEME_DOWNLOAD} from "../../modules/schema/models/types"
import api from "../../api/api"
import request from "../../stores/ipc/request"
import SwaggerDiff from 'swagger-diff'

export default {
  updateScheme: async function (context, {docId}) {
    try {
      const time = +new Date()
      const doc = await db.get(docId)
      const {url} = doc
      const response = await api.get(url)
      // save scheme file
      const fileData = JSON.stringify(response.data).toString()
      const fileId = `${getNewID()}.json`
      const {filePath} = await request.send('saveFile', {
        data: fileData,
        name: fileId
      })
      // save info about file
      const dwnlDoc = {
        schemaId: docId,
        createdAt: time,
        fileId,
        filePath
      }
      const schemeDownload = await context.dispatch('put', {
        type: SCHEME_DOWNLOAD,
        doc: dwnlDoc
      })
      // update data in scheme doc
      doc.lastUpdateAt = time
      await context.dispatch('put', {
        type: SCHEME,
        doc: doc
      })
      // update diff
      const lastDiff = await context.dispatch('updateLastDiff', {
        docId
      })
      return {
        response,
        schemeDownload,
        lastDiff
      }
    } catch (e) {
      return Promise.reject(e)
    }
  },
  updateLastDiff: async function (context, {docId}) {
    try {
      let {rows} = await db.allDocs({
        include_docs: true
      })
      let diff = {}
      rows = rows.filter(v => v.doc.schemaId === docId)
      if (rows.length > 1) {
        let sortFunc = docSortComparator('createdAt', -1)
        rows = rows.sort(sortFunc)
        const result = await context.dispatch('readDiff', {
          fisrtId: rows[0].id,
          lastId: rows[1].id
        })
        diff = result.diff
        let hasChanges = false
        for (let key in diff) {
          if (diff[key].length > 0) {
            hasChanges = true
          }
        }
        if (hasChanges === true) {
          let doc = await db.get(docId)
          doc.lastChangesAt = +new Date()
          doc.lastChanges = diff
          await context.dispatch('put', {
            type: doc.type,
            doc
          })
        }
      }
      return diff
    } catch (e) {
      return Promise.reject(e)
    }
  },
  readDiff: async function (context, {fisrtId, lastId}) {
    try {
      let first = await db.get(fisrtId)
      let last = await db.get(lastId)
      const firstData = await request.send('readFile', {
        filePath: first.filePath
      })
      const lastData = await request.send('readFile', {
        filePath: last.filePath
      })
      let firstObject = JSON.parse(firstData.data)
      let lastObject = JSON.parse(lastData.data)
      const diff = await SwaggerDiff(lastObject, firstObject)
      return {
        diff,
        firstObject,
        lastObject
      }
    } catch (e) {
      return Promise.reject(e)
    }
  },
  put: async function (context, {type, doc = {}}) {
    doc.type = type
    doc._id = doc._id || `${getNewID()}/${type}`
    try {
      const result = await db.put(doc)
      await context.dispatch('allDocs', {type})
      return result
    } catch (e) {
      return Promise.reject(e)
    }
  },
  allDocs (context, {type}) {
    db.allDocs({
      include_docs: true
    }).then(r => {
      let rows = []
      if (r && r.rows) {
        rows = r.rows.filter(v => v.doc.type === type)
      }
      rows = rows.reverse()
      context.commit('syncDocs', {
        rows,
        type
      })
      return r
    }).catch(e => {
      return Promise.reject(e)
    })
  },
  get (context, {docId}) {
    db.get(docId).then(r => {
      console.log(r)
      return r
    }).catch(e => {
      return Promise.reject(e)
    })
  },
  removeAll: async function (context, {$filter}) {
    try {
      let {rows} = await db.allDocs({
        include_docs: true
      })
      for (let key in $filter) {
        rows = rows.filter(v => v.doc[key] === $filter[key])
      }
      for (let i = 0; i < rows.length; i++) {
        await context.dispatch('remove', {
          type: rows[i].doc.type,
          docId: rows[i].id
        })
      }
      return true
    } catch (e) {
      return Promise.reject(e)
    }
  },
  remove: async function (context, {type, docId, removeFile = true}) {
    try {
      const doc = await db.get(docId)
      const result = await db.remove(doc)
      if (removeFile && doc.filePath) {
        await request.send('removeFile', {
          filePath: doc.filePath
        })
      }
      await context.dispatch('allDocs', {type})
      if (result.error) {
        return Promise.reject(result)
      }
      return result
    } catch (e) {
      return Promise.reject(e)
    }
  }
}
