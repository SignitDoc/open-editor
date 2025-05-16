import JSZip from 'jszip'
import { getTextFromHtml } from 'simple-mind-map/src/utils/index'
import {
  getSummaryText,
  addSummaryData,
  handleNodeImageFromXmind
} from 'simple-mind-map/src/utils/xmind'
import { v4 as uuidv4 } from 'uuid'
import {isNil} from 'lodash'

const isUndefined = data => {
  return isNil(data)|| data === ''
}


// 创建节点唯一的id
export const createUid = () => {
  return uuidv4()
}

// 格式化获取节点的概要数据
export const formatGetNodeGeneralization = data => {
  const generalization = data.generalization
  if (generalization) {
    return Array.isArray(generalization) ? generalization : [generalization]
  } else {
    return []
  }
}
//  获取节点区间概要
const getRangeGeneralization = data => {
  const list = formatGetNodeGeneralization(data)
  return list.filter(item => {
    return item.range && item.range.length > 0
  })
}

// 导出为xmind时，将概要转换为xmind的格式
export const parseNodeGeneralizationToXmind = node => {
  const summary = []
  const summaries = []
  const collectSummary = (item, startIndex, endIndex) => {
    const summaryTopicId = createUid()
    const summaryTitle = getTextFromHtml(item.text)
    summary.push({
      id: summaryTopicId,
      title: summaryTitle,
      attributedTitle: [
        {
          text: summaryTitle
        }
      ]
    })
    summaries.push({
      id: createUid(),
      range: '(' + startIndex + ',' + endIndex + ')',
      topicId: summaryTopicId
    })
  }
  // 在xmind中，概要都是保存在父节点的
  // 而在simple-mind-map中，区间概要保存在父节点中，不带区间的保存在自身
  // 所以先要过滤出自身的区间概要
  const generalizationList = getRangeGeneralization(node.data)
  generalizationList.forEach(item => {
    collectSummary(item, item.range[0], item.range[1])
  })

  // 遍历子节点，找出子节点自身的概要
  ;(node.children || []).forEach((child, childIndex) => {
    const list = getSelfGeneralization(child.data)
    list.forEach(item => {
      collectSummary(item, childIndex, childIndex)
    })
  })

  return {
    summary,
    summaries
  }
}


//  获取节点自身的概要，非子节点区间
const getSelfGeneralization = data => {
  const list = formatGetNodeGeneralization(data)
  return list.filter(item => {
    return !item.range || item.range.length <= 0
  })
}


//  图片转成dataURL
export const imgToDataUrl = (src, returnBlob = false) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    // 跨域图片需要添加这个属性，否则画布被污染了无法导出图片
    img.setAttribute('crossOrigin', 'anonymous')
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d') 
        // 图片绘制到canvas里
        ctx.drawImage(img, 0, 0, img.width, img.height)
        if (returnBlob) {
          canvas.toBlob(blob => {
            resolve(blob)
          })
        } else {
          resolve(canvas.toDataURL())
        }
      } catch (e) {
        reject(e)
      }
    }
    img.onerror = e => {
      reject(e)
    }
    img.src = src
  })
}
// 解析dataUrl
export const parseDataUrl = data => {
  if (!/^data:/.test(data)) return data
  const [typeStr, base64] = data.split(',')
  const res = /^data:[^/]+\/([^;]+);/.exec(typeStr)
  const type = res[1]
  return {
    type,
    base64
  }
}

// 导出为xmind时，处理图片数据
export const handleNodeImageToXmind = async (
  node,
  newData,
  promiseList,
  imageList
) => {
  if (node.data.image) {
    // 处理异步逻辑
    let resolve = null
    const promise = new Promise(_resolve => {
      resolve = _resolve
    })
    promiseList.push(promise)
    try {
      let imgName = ''
      let imgData = node.data.image
      // base64之外的其他图片要先转换成data:url
      if (!/^data:/.test(node.data.image)) {
        imgData = await imgToDataUrl(node.data.image)
      }
      // 从data:url中解析出图片类型和ase64
      const dataUrlRes = parseDataUrl(imgData)
      imgName = 'image_' + imageList.length + '.' + dataUrlRes.type
      imageList.push({
        name: imgName,
        data: dataUrlRes.base64
      })
      newData.image = {
        src: 'xap:resources/' + imgName,
        width: node.data.imageSize.width,
        height: node.data.imageSize.height
      }
      resolve()
    } catch (error) {
      console.log(error)
      resolve()
    }
  }
}


export const getXmindContentXmlData = () => {
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?><xmap-content xmlns="urn:xmind:xmap:xmlns:content:2.0" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xlink="http://www.w3.org/1999/xlink" modified-by="bruce" timestamp="1503058545540" version="2.0">    <sheet id="7abtd0ssc7n4pi1nu6i7b6lsdh" modified-by="bruce" theme="0kdeemiijde6nuk97e4t0vpp54" timestamp="1503058545540">        <topic id="1vr0lcte2og4t2sopiogvdmifc" modified-by="bruce" structure-class="org.xmind.ui.logic.right" timestamp="1503058545417">            <title>Warning                警告                Attention                Warnung                경고</title>            <children>                <topics type="attached">                    <topic id="71h1aip2t1o8vvm0a41nausaar" modified-by="bruce" timestamp="1503058545423">                        <title svg:width="500">This file can not be opened normally, please do not modify and save, otherwise the contents will be permanently lost！</title>                        <children>                            <topics type="attached">                                <topic id="428akmkh9a0tog6c91qj995qdl" modified-by="bruce" timestamp="1503058545427">                                    <title>You can try using XMind 8 Update 3 or later version to open</title>                                </topic>                            </topics>                        </children>                    </topic>                    <topic id="2kb87f8m38b3hnfhp450c7q35e" modified-by="bruce" timestamp="1503058545434">                        <title svg:width="500">该文件无法正常打开，请勿修改并保存，否则文件内容将会永久性丢失！</title>                        <children>                            <topics type="attached">                                <topic id="3m9hoo4a09n53ofl6fohdun99f" modified-by="bruce" timestamp="1503058545438">                                    <title>你可以尝试使用 XMind 8 Update 3 或更新版本打开</title>                                </topic>                            </topics>                        </children>                    </topic>                    <topic id="7r3r4617hvh931ot9obi595r8f" modified-by="bruce" timestamp="1503058545444">                        <title svg:width="500">該文件無法正常打開，請勿修改並保存，否則文件內容將會永久性丟失！</title>                        <children>                            <topics type="attached">                                <topic id="691pgka6gmgpgkacaa0h3f1hjb" modified-by="bruce" timestamp="1503058545448">                                    <title>你可以嘗試使用 XMind 8 Update 3 或更新版本打開</title>                                </topic>                            </topics>                        </children>                    </topic>                    <topic id="0f2e3rpkfahg4spg4nda946r0b" modified-by="bruce" timestamp="1503058545453">                        <title svg:width="500">この文書は正常に開かないので、修正して保存しないようにしてください。そうでないと、書類の内容が永久に失われます。！</title>                        <children>                            <topics type="attached">                                <topic id="4vuubta53ksc1falk46mevge0t" modified-by="bruce" timestamp="1503058545457">                                    <title>XMind 8 Update 3 や更新版を使って開くこともできます</title>                                </topic>                            </topics>                        </children>                    </topic>                    <topic id="70n9i4u3lb89sq9l1m1bs255j5" modified-by="bruce" timestamp="1503058545463">                        <title svg:width="500">Datei kann nicht richtig geöffnet werden. Bitte ändern Sie diese Datei nicht und speichern Sie sie, sonst wird die Datei endgültig gelöscht werden.</title>                        <children>                            <topics type="attached">                                <topic id="1qpc5ee298p2sqeqbinpca46b7" modified-by="bruce" timestamp="1503058545466">                                    <title svg:width="500">Bitte versuchen Sie, diese Datei mit XMind 8 Update 3 oder später zu öffnen.</title>                                </topic>                            </topics>                        </children>                    </topic>                    <topic id="4dmes10uc19pq7enu8sc4bmvif" modified-by="bruce" timestamp="1503058545473">                        <title svg:width="500">Ce fichier ne peut pas ouvert normalement, veuillez le rédiger et sauvegarder, sinon le fichier sera perdu en permanence. </title>                        <children>                            <topics type="attached">                                <topic id="5f0rivgubii2launodiln7sdkt" modified-by="bruce" timestamp="1503058545476">                                    <title svg:width="500">Vous pouvez essayer d'ouvrir avec XMind 8 Update 3 ou avec une version plus récente.</title>                                </topic>                            </topics>                        </children>                    </topic>                    <topic id="10pn1os1sgfsnqa8akabom5pej" modified-by="bruce" timestamp="1503058545481">                        <title svg:width="500">파일을 정상적으로 열 수 없으며, 수정 및 저장하지 마십시오. 그렇지 않으면 파일의 내용이 영구적으로 손실됩니다!</title>                        <children>                            <topics type="attached">                                <topic id="0l2nr0fq3em22rctapkj46ue58" modified-by="bruce" timestamp="1503058545484">                                    <title svg:width="500">XMind 8 Update 3 또는 이후 버전을 사용하여</title>                                </topic>                            </topics>                        </children>                    </topic>                </topics>            </children>            <extensions>                <extension provider="org.xmind.ui.map.unbalanced">                    <content>                        <right-number>-1</right-number>                    </content>                </extension>            </extensions>        </topic>        <title>Sheet 1</title>    </sheet></xmap-content>`
}



//  转换xmind数据
const transformXmind = async (content, files, handleMultiCanvas) => {
  content = JSON.parse(content)
  let data = null
  if (content.length > 1 && typeof handleMultiCanvas === 'function') {
    data = await handleMultiCanvas(content)
  }
  if (!data) {
    data = content[0]
  }
  const nodeTree = data.rootTopic
  const newTree = {}
  const waitLoadImageList = []
  const walk = async (node, newNode) => {
    newNode.data = {
      // 节点内容
      text: isUndefined(node.title) ? '' : node.title
    }
    // 节点备注
    if (node.notes) {
      const notesData = node.notes.realHTML || node.notes.plain
      newNode.data.note = notesData ? notesData.content || '' : ''
    }
    // 超链接
    if (node.href && /^https?:\/\//.test(node.href)) {
      newNode.data.hyperlink = node.href
    }
    // 标签
    if (node.labels && node.labels.length > 0) {
      newNode.data.tag = node.labels
    }
    // 图片
    handleNodeImageFromXmind(node, newNode, waitLoadImageList, files)
    // 概要
    const selfSummary = []
    const childrenSummary = []
    if (newNode._summary) {
      selfSummary.push(newNode._summary)
    }
    if (Array.isArray(node.summaries) && node.summaries.length > 0) {
      node.summaries.forEach(item => {
        addSummaryData(
          selfSummary,
          childrenSummary,
          () => {
            return getSummaryText(node, item.topicId)
          },
          item.range
        )
      })
    }
    newNode.data.generalization = selfSummary
    // 子节点
    newNode.children = []
    if (
      node.children &&
      node.children.attached &&
      node.children.attached.length > 0
    ) {
      node.children.attached.forEach((item, index) => {
        const newChild = {}
        newNode.children.push(newChild)
        if (childrenSummary[index]) {
          newChild._summary = childrenSummary[index]
        }
        walk(item, newChild)
      })
    }
  }
  walk(nodeTree, newTree)
  await Promise.all(waitLoadImageList)
  return newTree
}



//  解析.xmind文件
export const parseXmindFile = (file, handleMultiCanvas) => {
  return new Promise((resolve, reject) => {
    JSZip.loadAsync(file).then(
      async zip => {
        try {
          let content = ''
          const jsonFile = zip.files['content.json']
          const xmlFile = zip.files['content.xml'] || zip.files['/content.xml']
          if (jsonFile) {
            const json = await jsonFile.async('string')
            console.log('元素',JSON.parse(json),file)

            content = await transformXmind(json, zip.files, handleMultiCanvas)
          }
          const title = file.name.replace(/\.xmind$/, '')
          if (content) {
            resolve({
              title:title,
              content:content
            })
          } else {
            reject(new Error('解析失败'))
          }
        } catch (error) {
          reject(error)
        }
      },
      e => {
        reject(e)
      }
    )
  })
}


// 数据转换为xmind文件
const transformToXmind = async (data, name) => {
  console.log('data',data,name)
  const id = 'simpleMindMap_' + Date.now()
  const imageList = []
  // 转换核心数据
  let newTree = {}
  let waitLoadImageList = []
  let walk = async (node, newNode, isRoot) => {
    let newData = {
      id: node.data.uid,
      structureClass: 'org.xmind.ui.logic.right',
      title: getTextFromHtml(node.data.text), // 节点文本
      children: {
        attached: []
      }
    }
    // 备注
    if (node.data.note !== undefined) {
      newData.notes = {
        realHTML: {
          content: node.data.note
        },
        plain: {
          content: node.data.note
        }
      }
    }
    // 超链接
    if (node.data.hyperlink !== undefined) {
      newData.href = node.data.hyperlink
    }
    // 标签
    if (node.data.tag !== undefined) {
      newData.labels = node.data.tag || []
    }
    // 图片
    handleNodeImageToXmind(node, newNode, waitLoadImageList, imageList)
    // 样式
    // 暂时不考虑样式
    if (isRoot) {
      newData.class = 'topic'
      newNode.id = id
      newNode.class = 'sheet'
      newNode.title = name
      newNode.extensions = []
      newNode.topicPositioning = 'fixed'
      newNode.topicOverlapping = 'overlap'
      newNode.coreVersion = '2.100.0'
      newNode.rootTopic = newData
    } else {
      Object.keys(newData).forEach(key => {
        newNode[key] = newData[key]
      })
    }
    // 概要
    const { summary, summaries } = parseNodeGeneralizationToXmind(node)
    if (isRoot) {
      if (summaries.length > 0) {
        newNode.rootTopic.children.summary = summary
        newNode.rootTopic.summaries = summaries
      }
    } else {
      if (summaries.length > 0) {
        newNode.children.summary = summary
        newNode.summaries = summaries
      }
    }
    // 子节点
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        let newChild = {}
        walk(child, newChild)
        newData.children.attached.push(newChild)
      })
    }
  }
  walk(data, newTree, true)
  await Promise.all(waitLoadImageList)
  const contentData = [newTree]
  // 创建压缩包
  const zip = new JSZip()
  zip.file('content.json', JSON.stringify(contentData))
  zip.file(
    'metadata.json',
    `{"modifier":"","dataStructureVersion":"2","creator":{"name":"mind-map"},"layoutEngineVersion":"3","activeSheetId":"${id}"}`
  )
  zip.file('content.xml', getXmindContentXmlData())
  const manifestData = {
    'file-entries': {
      'content.json': {},
      'metadata.json': {},
      'Thumbnails/thumbnail.png': {}
    }
  }
  // 图片
  if (imageList.length > 0) {
    imageList.forEach(item => {
      manifestData['file-entries']['resources/' + item.name] = {}
      const img = zip.folder('resources')
      img.file(item.name, item.data, { base64: true })
    })
  }
  zip.file('manifest.json', JSON.stringify(manifestData))
  const zipData = await zip.generateAsync({ type: 'blob' })
  return zipData
}

export {
  transformXmind,
  transformToXmind
}
