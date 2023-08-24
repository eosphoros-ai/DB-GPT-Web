'use client'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      'Knowledge Space': 'Knowledge Space',
      space: 'space',
      Vector: 'Vector',
      Owner: 'Owner',
      Docs: 'Docs',
      'Knowledge Space Config': 'Knowledge Space Config',
      'Choose a Datasource type': 'Choose a Datasource type',
      'Setup the Datasource': 'Setup the Datasource',
      'Knowledge Space Name': 'Knowledge Space Name',
      'Please input the name': 'Please input the name',
      'Please input the owner': 'Please input the owner',
      Description: 'Description',
      'Please input the description': 'Please input the description',
      Next: 'Next',
      'the name can only contain numbers, letters, Chinese characters, "-" and "_"':
        'the name can only contain numbers, letters, Chinese characters, "-" and "_"',
      Text: 'Text',
      'Fill your raw text': 'Fill your raw text',
      URL: 'URL',
      'Fetch the content of a URL': 'Fetch the content of a URL',
      Document: 'Document',
      'Upload a document, document type can be PDF, CSV, Text, PowerPoint, Word, Markdown':
        'Upload a document, document type can be PDF, CSV, Text, PowerPoint, Word, Markdown',
      Name: 'Name',
      'Text Source(Optional)': 'Text Source(Optional)',
      'Please input the text source': 'Please input the text source',
      Synch: 'Synch',
      Back: 'Back',
      Finish: 'Finish',
      'Web Page URL': 'Web Page URL',
      'Please input the Web Page URL': 'Please input the Web Page URL',
      'Select or Drop file': 'Select or Drop file',
      Documents: 'Documents',
      Chat: 'Chat',
      'Add Datasource': 'Add Datasource',
      Arguments: 'Arguments',
      Type: 'Type',
      Size: 'Size',
      'Last Synch': 'Last Synch',
      Status: 'Status',
      Result: 'Result',
      Details: 'Details',
      Delete: 'Delete',
      Operation: 'Operation',
      Submit: 'Submit',
      Chunks: 'Chunks',
      Content: 'Content',
      'Meta Data': 'Meta Data',
      'Please select a file': 'Please select a file',
      'Please input the text': 'Please input the text',
      Embedding: 'Embedding',
      topk: 'topk',
      'the top k vectors based on similarity score':
        'the top k vectors based on similarity score',
      recall_score: 'recall_score',
      'Set a threshold score for the retrieval of similar vectors':
        'Set a threshold score for the retrieval of similar vectors',
      recall_type: 'recall_type',
      'recall type': 'recall type',
      model: 'model',
      'A model used to create vector representations of text or other data':
        'A model used to create vector representations of text or other data',
      chunk_size: 'chunk_size',
      'The size of the data chunks used in processing':
        'The size of the data chunks used in processing',
      chunk_overlap: 'chunk_overlap',
      'The amount of overlap between adjacent data chunks':
        'The amount of overlap between adjacent data chunks',
      Prompt: 'Prompt',
      scene: 'scene',
      'A contextual parameter used to define the setting or environment in which the prompt is being used':
        'A contextual parameter used to define the setting or environment in which the prompt is being used',
      template: 'template',
      'A pre-defined structure or format for the prompt, which can help ensure that the AI system generates responses that are consistent with the desired style or tone.':
        'A pre-defined structure or format for the prompt, which can help ensure that the AI system generates responses that are consistent with the desired style or tone.',
      max_token: 'max_token',
      'The maximum number of tokens or words allowed in a prompt':
        'The maximum number of tokens or words allowed in a prompt',
      Theme: 'Theme',
      'database list': 'database list',
      'Link address/domain name': 'Address',
      Port: 'Port',
      Username: 'Username',
      Password: 'Password',
      Remark: 'Remark',
      'Add a new line': 'Add a new line',
      Edit: 'Edit'
    }
  },
  zh: {
    translation: {
      'Knowledge Space': '知识库',
      space: '知识库',
      Vector: '向量',
      Owner: '创建人',
      Docs: '文档数',
      'Knowledge Space Config': '知识库配置',
      'Choose a Datasource type': '选择数据源类型',
      'Setup the Datasource': '设置数据源',
      'Knowledge Space Name': '知识库名称',
      'Please input the name': '请输入名称',
      'Please input the owner': '请输入创建人',
      Description: '描述',
      'Please input the description': '请输入描述',
      Next: '下一步',
      'the name can only contain numbers, letters, Chinese characters, "-" and "_"':
        '名称只能包含数字、字母、中文字符、-或_',
      Text: '文本',
      'Fill your raw text': '填写您的原始文本',
      URL: '网址',
      'Fetch the content of a URL': '获取 URL 的内容',
      Document: '文档',
      'Upload a document, document type can be PDF, CSV, Text, PowerPoint, Word, Markdown':
        '上传文档，文档类型可以是PDF、CSV、Text、PowerPoint、Word、Markdown',
      Name: '名称',
      'Text Source(Optional)': '文本来源（可选）',
      'Please input the text source': '请输入文本来源',
      Synch: '同步',
      Back: '上一步',
      Finish: '完成',
      'Web Page URL': '网页网址',
      'Please input the Web Page URL': '请输入网页网址',
      'Select or Drop file': '选择或拖拽文件',
      Documents: '文档',
      Chat: '对话',
      'Add Datasource': '添加数据源',
      Arguments: '参数',
      Type: '类型',
      Size: '类型',
      'Last Synch': '上次同步时间',
      Status: '状态',
      Result: '结果',
      Details: '明细',
      Delete: '删除',
      Operation: '操作',
      Submit: '提交',
      Chunks: '切片',
      Content: '内容',
      'Meta Data': '元数据',
      'Please select a file': '请上传一个文件',
      'Please input the text': '请输入文本',
      Embedding: '嵌入',
      topk: '球',
      'the top k vectors based on similarity score':
        '基于相似度得分的前 k 个向量',
      recall_score: '召回分数',
      'Set a threshold score for the retrieval of similar vectors':
        '设置相似向量检索的阈值分数',
      recall_type: '回忆类型',
      'recall type': '回忆类型',
      model: '模型',
      'A model used to create vector representations of text or other data':
        '用于创建文本或其他数据的矢量表示的模型',
      chunk_size: '块大小',
      'The size of the data chunks used in processing':
        '处理中使用的数据块的大小',
      chunk_overlap: '块重叠',
      'The amount of overlap between adjacent data chunks':
        '相邻数据块之间的重叠量',
      Prompt: '迅速的',
      scene: '场景',
      'A contextual parameter used to define the setting or environment in which the prompt is being used':
        '用于定义使用提示的设置或环境的上下文参数',
      template: '模板',
      'A pre-defined structure or format for the prompt, which can help ensure that the AI system generates responses that are consistent with the desired style or tone.':
        '预定义的提示结构或格式，有助于确保人工智能系统生成与所需风格或语气一致的响应。',
      max_token: '最大令牌',
      'The maximum number of tokens or words allowed in a prompt':
        '提示中允许的最大标记或单词数',
      Theme: '主题',
      'database list': '数据库列表',
      'Link address/domain name': '链接地址/域名',
      Port: '端口',
      Username: '用户名',
      Password: '密码',
      Remark: '备注',
      'Add a new line': '新增一行',
      Edit: '编辑'
    }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
