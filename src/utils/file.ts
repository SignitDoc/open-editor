// 文件校验类型
export interface FileRuleType {
  target: string
  regExp: RegExp
}

// 文件错误类型枚举
export enum FileError {
  // 超出文件大小限制
  ERROR_MAX_SIZE = "ERROR_MAX_SIZE",
  // 文件类型错误
  ERROR_FILE_TYPE = "ERROR_FILE_TYPE"
}

// 选择单个文件
export function selectFile(acceptType, maxSize) {
  const input = document.createElement("input")
  input.type = "file"
  input.style.display = "none"
  // 需要自动触发一次
  document.body.appendChild(input)
  input.accept = acceptType
  input.click()
  document.body.removeChild(input)
  // 获取文件后做类型检查和文件大小检查
  return new Promise((resolve, reject) => {
    input.onchange = e => {
      if (!input.files || input.files?.length <= 0) return
      const file = input.files[0]
      // 文件大小检查
      // maxSize的单位是byte，需要转换
      if (file.size > maxSize) reject(FileError.ERROR_MAX_SIZE)

      // 文件类型检查
      const accepts = acceptType.split(",")
      // 文件类型的校验规则
      const acceptTests: Array<FileRuleType> = []
      accepts.forEach(type => {
        // 传输的类型是.分割的后缀名称
        if (/^\./.test(type)) {
          //用后缀检查
          acceptTests.push({
            target: "name", //检查名称
            regExp: new RegExp(`${type.replace(".", "\\.")}$`, "i")
          })
        }
        //用MIME类型检查
        else if (/\/\*$/.test(type)) {
          acceptTests.push({
            target: "type", //检查MIME类型
            regExp: new RegExp(`^${type.replace("*", "\\S+")}$`, "i")
          })
        } else {
          // acceptType没有写清楚是后缀还是MIME类型，则两个都加入校验中
          acceptTests.push({
            target: "type", //检查MIME类型
            regExp: new RegExp(`^${type}$`, "i")
          })
          acceptTests.push({
            target: "name", //检查后缀
            regExp: new RegExp(`${type}$`, "i")
          })
        }
      })
      // 校验类型是否符合规则
      const isType = acceptTests.some(test => {
        return test.regExp.test(file[test.target])
      })
      if (!isType) reject(FileError.ERROR_FILE_TYPE)

      // 大小和类型都检查无误，则返回符合校验的文件
      resolve(file)
    }
  })
}

// blob转base64
export function blobToBase64(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

// base64 转 blob
export function base64ToBlob(baseData) {
  // 1. 去掉 Base64 数据 URL 的前缀部分
  const data = baseData.split(",")[1]

  // 2. 解码 Base64 字符串
  const binaryString = atob(data)

  // 3. 创建一个 Uint8Array 对象
  const binaryLen = binaryString.length
  const bytes = new Uint8Array(binaryLen)
  for (let i = 0; i < binaryLen; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  // 4. 创建一个 Blob 对象
  const blob = new Blob([bytes], { type: "image/jpeg" })
  return blob
}
