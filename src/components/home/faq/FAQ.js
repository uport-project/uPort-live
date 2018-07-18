import React from 'react'
import Markdown from 'markdown-to-jsx'

import FAQ from '../../../../faq.md'

const FAQPage = () => (
  <main className="container">
    <div id="bodyContent" className="fullpage" style={{textAlign: 'left'}}>
      <Markdown>
        {FAQ}
      </Markdown>
    </div>
  </main>
)

export default FAQPage