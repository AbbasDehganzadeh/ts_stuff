/*
 * a helper module for parsing, and extracting context.
 */


class HTMLParser{

  LOG = false
  /* CONSTANTS */
  OPEN_FLOW = "<%"
  CLOSE_FLOW = "%>"
  OPEN_LOG = "<%="
  CLOSE_LOG = "%>"

  PATT_IF = /^<%\s?if\s+(?<cond_1>\~?)(?<let_1>\w+)((?<cond_2>[!><=])(?<let_2>\w+))?\s?%>$/
  PATT_ELSE = /^<%\s?else\s?%>$/
  PATT_ENDIF = /^<%\s?endif\s?%>$/
  PATT_FOR = /^<%\s?for\s+(?<obj>\w+)\s+of\s+(?<objs>\w+)\s?%>$/
  PATT_ENDFOR = /^<%\s?endfor\s?%>$/
  PATT_LOG = /^(?<snip_1>(<\w+(\s+[a-zA-Z]+="[\w_-]*")*>)*)<%=\s?(?<obj>\w+(\.\w+)?)\s?%>(?<snip_2>(<\/\w+>)*)$/
  PATT_VALUE = /^(?<snip_1><\/?\s?\w+\s?(href|id|value)=('.*)?")<%=\s?(?<obj>\w+(\.\w+)?)\s?%>(?<snip_2>"(.*')?(\s?.*=.*)*\s?\/?>)$/

  /* FLAGS */
  in_if = false
  in_if_not = false
  in_if_else = false

  in_for = false
  range_loop = 0 // number of iter_
  number_loop = 0 // current iter_
  line_loop = -1 // line starts loop
  const_loop = '' // inner var_ loop
  list_loop = '' // outer var_ loop

  context = {"a":1,"b":2,"z":0}


  constructor(context) {
    //TODO: update context object;
    if (context)
      this.context = context
  }

  parse(str) {
    const lines = str.split('\n')
    const tokens = new Array()
    console.info({context:this.context,len:lines.length})
    if (lines.length <= 10) this.LOG = true
    for (let i=0; i<lines.length; i++) {
      const line = lines[i]
      this.LOG && console.info({line})
      const token = this.match(line.trim())
      // check if pattern exists, or not
      if (token.type != 'COND') {
        // check based on if-statement
        if (!this.isParsable()) continue
      }
      if (token.type == 'LOOP') {
        // At the end-loop, It goes back to loop
        i = this.switchLoop(i, token)
      }
      this.LOG && console.info({ //? just DEBUG
        InIf:this.in_if,InIfNot:this.in_if_not,InElse:this.in_if_else,
        InFor:this.in_for,NumLoop:this.number_loop,LnLoop:this.line_loop,
        RangLoop:this.range_loop,CtxLoop:this.const_loop,VarLoop:this.list_loop,
      })
      if (token.type) {
        if (token.out_ == line)
          console.info({unkn:token})
        if (token.type == 'LOG') {
          tokens.push(token.out_)
        }
      } else {
        tokens.push(line)
      }
      this.LOG && console.log('\n')
    }
    const output = tokens.join('\n')
    console.log(output)
    return output
  }

  isParsable() {
    // Checks line in truthy condition, or falsy
    // DEFAULT: true
    if (this.in_if && this.in_if_else) {
      return false //? if ... else {;}
    }
    if (this.in_if_not && !this.in_if_else) {
      return false //? if {;} else ...
    }
    // Checks for invalid loop
    if (this.in_for && !this.range_loop) {
      return false // for {;} ...
    }
    // otherwise:
    return true
  }

  switchLoop(l, token) {
    // At start-loop: Defines essential var_ for functioning
    if (token.out_.startsWith('FORLOOP')) {
      if (this.in_for) this.line_loop = l
    }
    // At end-loop: Do functioning based on defined var_
    if (token.out_ == 'ENDLOOP') {
      if (this.in_for) return this.line_loop
      else this.line_loop = -1
    }
    return l // current line
  }

  match(tex) {
    let res = {type: null, out_: null}
    let match = tex.match(this.PATT_LOG) || tex.match(this.PATT_VALUE)
    if (match) {res['type']='LOG';res['out_']=this.handleLog(match)}
    match = tex.match(this.PATT_FOR)
    if (match) {res['type']='LOOP';res['out_']=this.handleFor(match)}
    match = tex.match(this.PATT_ENDFOR)
    if (match) {res['type']='LOOP';res['out_']=this.handleEndfor(match)}
    match = tex.match(this.PATT_IF)
    if (match) {res['type']='COND';res['out_']=this.handleIf(match)}
    match = tex.match(this.PATT_ELSE)
    if (match) {res['type']='COND';res['out_']=this.handleElse(match)}
    match = tex.match(this.PATT_ENDIF)
    if (match) {res['type']='COND';res['out_']=this.handleEndif(match)}

    this.LOG && console.info({'matching':res})
    return res
  }

  handleIf(pattern) {
    console.info({pattern:"IF"})
    this.LOG && console.info(pattern.slice(1))
    let txt = 'IF' // potential output

    const {cond_1,let_1,cond_2,let_2} = pattern.groups
    /* inner-func to evaluate statement */
    const cond = function(context) {
      const v1 = context[String(let_1).trim()]
      const v2 = context[String(let_2).trim()]
      console.info({l1:let_1,l2:let_2,v1,v2})
      if (v1 == undefined && v2 == undefined) // value could be falsy;v1? & v2.
        return false // check var_ in context
      if (v1 == undefined)
        return false // Duplicity...
      let result = false // check condition
      switch(cond_2) { /* binary oper_ */
        case('>'):
          result = v1 >= v2
          break
        case('<'):
          result = v1 <= v2
          break
        case('='):
          result = v1 == v2
          break
        case('!'):
          result = v1 != v2
          break
        default: /* unary oper_ */
          if (cond_1 == '~') // negate
            result = !v1
          else
            result = !!v1
      }
      return result
    }(this.context)

    switch(cond) {
      case(true):
        this.in_if = true
        txt = 'TRUE' //! testing
        break
      case(false):
        this.in_if_not = true
        txt = 'FALSE' //! testing
        break
      default:
        this.in_if_else = true
        txt = pattern[0]
    }
    return txt
  }
  handleElse(pattern) {
    console.info({pattern:"ELSE"})
    let txt = 'ELSE' // potential output
    if ((!this.in_if && !this.in_if_not) || this.in_if_else) { // unrecognized!
      this.in_if = true
      this.in_if_else = true // !DELETE-IT
      txt = pattern[0]
    }
    this.in_if_else = true //? in-scope
    return txt
  }
  handleEndif(pattern) {
    console.info({pattern:"ENDIF"})
    let txt = 'ENDIF' // potential output
    if (!this.in_if && !this.in_if_not)
      txt = pattern[0] // unrecognized!
    /*out of condition */
    this.in_if = false
    this.in_if_not = false
    return txt
  }
  handleFor(pattern) {
    console.info({pattern:"FOR"})
    this.LOG && console.info(pattern.slice(1))
    let txt = 'FORLOOP' // potential output

    if (this.in_for) { // Already in loop
      //! not support inner-loop
      txt = pattern[0] // unrecognized!
      this.range_loop = 0
      return txt
    }

    this.in_for = true // Already in-loop
    const {obj,objs} = pattern.groups
    this.const_loop = obj // stores var_ name
    this.list_loop = objs // stores var_ name
    /* inner-func to evaluate statement */
    const {object, list} = function(context) {
      const let_ = String(obj).trim()
      const list_ = context[String(objs).trim()]
      console.info({l1:let_,l2:objs,ll:list_})
      if (list_ == undefined || !list_.length) // value could be empty iter_
        return {object:null, list: null} // check var_ in context
      txt = `${txt}:${obj},${objs}`
      return {object:let_, list:list_}
    }(this.context)

    if (!object) { // var_ not in context
      txt = pattern[0] // unrecognized!
      this.range_loop = 0
    } else { // Difine loop vars
      this.range_loop = list.length
    }

    return txt
  }
  handleEndfor(pattern) {
    console.info({pattern:"ENDFOR"})
    let txt = 'ENDLOOP' // potential output
    if (!this.in_for) 
      txt = pattern[0] // unrecognized!

    this.number_loop++ // incr- i;
    if (this.number_loop >= this.range_loop) {
      /*out of loop */
      // reset loop vars
      this.in_for = false
      this.range_loop = 0
      this.number_loop = 0
      this.const_loop = ''
      this.list_loop = ''
    }
    return txt
  }
  handleLog(pattern) {
    console.info({pattern:"LOG"})
    this.LOG && console.info(pattern.slice(1))
    let txt = 'LOG' // potential output
    let ctx = undefined
    const {snip_1,snip_2, obj} = pattern.groups
    const [key, prop] = obj.split('.')
    /* basic log */
    ctx = this.context[key]
    if (prop && ctx != undefined)
      ctx = ctx[prop]

    /* in-loop log */
    if (this.in_for) {
      if (key == this.const_loop) {
        const item = this.context[this.list_loop][this.number_loop]
        ctx = item
        if (prop && ctx != undefined)
          ctx = item[prop]
      }
    }

    // Keep Template
    if (ctx != undefined)
      txt = `${snip_1}${ctx}${snip_2}`
    else
      txt = pattern[0] // unrecognized!

    return txt
  }

}

module.exports = {
  HTMLParser,
}
