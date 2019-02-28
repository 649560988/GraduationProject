// const { exec } = require('child_process')
// const path = require('path')

// exec(`cd .. && git diff --name-only --cached --relative`, (err, stdout, stderr) => {
//   if (err) {
//     console.error(`${stdout}`)
//     process.exit(1)
//   }

//   const filtered = stdout.split(/\r?\n/).filter(item => {
//     if (item.length === 0) return false
//     return !!item.match(/^admin\/src.*\.jsx?$/)
//   })

//   filtered.forEach(item => {
//     const standard = path.resolve(process.cwd(), './node_modules/.bin/standard')
//     const filepath = path.resolve(process.cwd(), '..', item)
//     exec(`${standard} ${filepath}`, (err, stdout, stderr) => {
//       if (err) {
//         console.error(stdout)
//         console.log('JavaScript Standard Style errors were detected. Aborting commit.')
//         process.exit(2)
//       }
//     })
//   })
// })
