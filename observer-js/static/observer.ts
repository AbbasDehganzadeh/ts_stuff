/// define elements!
const subj_inp = document.querySelector('#event_inp')
const subj_btn = document.querySelector('#notify_btn')
const obsv_name = document.querySelector('#obs_name')
const obsv_col = document.querySelector('#obs_col')
const obsv_sec = document.querySelector('#obs_sec')
const obsv_btn = document.querySelector('#subscribe_btn')
const subs_log = document.querySelector('#subscribers_log')
const events_log = document.querySelector('#events_log')

interface IObserver<T> {
  id: string
  name: string
  update(data: T): void
}

interface ISubject<T> {
  subscribe(subscriber: IObserver<T>): () => void;
  notify(data: T): void
}

type ObserverMetadata<T> = IObserver<T> & Partial<{
  color: string
  second: number
  unsub: () => void
}>;

class Producer<T> implements ISubject<T> {
  private observers = new Set<ObserverMetadata<T>>()

  subscribe(subscriber: ObserverMetadata<T>) {
    this.observers.add(subscriber)
    return () => this.unsubscribe(subscriber)
  }
  unsubscribe(subscriber: ObserverMetadata<T>): void {
    this.observers.delete(subscriber)
  }

  async notify(data: T) {
    const observers = Array.from(this.observers);
    for (let observer of observers) {
      observer.update(data)
    }
  }
}

class Consumer implements IObserver<string> {
  constructor(private readonly _id: string, private _name: string, private _second: number, public color: string) { }

  async update(data: string) {
    await timeout(this.second * 1000)
    logEvent(data, this)
    console.log(`${this.id}: ${data}`)
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }

  get second() {
    return this._second;
  }
  set second(sec_: number) {
    this._second = sec_;
  }
}

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const logEvent = (data: string, sub: ObserverMetadata<string>) => {
  const record = document.createElement('p')
  record.innerHTML = `<span class="spec_name" style="color: ${sub.color};">${sub.name}</span>: ${data}`
  record.classList.add("record")
  events_log?.appendChild(record)
  events_log!.scrollTop = events_log!.scrollHeight ?? 0
}

function logsubscribe() {
  subs_log!.innerHTML = ""; // erase completely
  subscribers.forEach(sub => {
    // sub_wrapper
    const sub_wrap = document.createElement('div')
    sub_wrap.classList.add("sub_wrap")
    // sub_config
    const sub_conf = document.createElement('div')
    const sec_btn = document.createElement('input')
    const del_btn = document.createElement('button')
    sec_btn.value = String(sub.second) + " sec"
    sec_btn.disabled = true
    del_btn.textContent = 'X'
    sub_conf.classList.add("sub_conf")
    sec_btn.classList.add("sec_btn")
    del_btn.classList.add("del_btn")
    del_btn.addEventListener('click', () => onunsubscribe(sub.id))
    sub_conf.appendChild(sec_btn)
    sub_conf.appendChild(del_btn)
    // text record
    const record = document.createElement('p')
    record.innerHTML = `${sub.id}: <span class="spec_name" style="color: ${sub.color};">${sub.name}</span>`
    record.classList.add("record")
    sub_wrap.appendChild(record)
    sub_wrap.appendChild(sub_conf)
    subs_log!.appendChild(sub_wrap)
  })
}

function onnotify() {
  const data = (<HTMLInputElement>subj_inp).value
  producer.notify(data).then(() =>
    console.info("All Observers recieved!")
  ).catch(e => console.error(e))
}

function onsubscribe() {
  const id_ = String(Math.floor(1000 + Math.random() * 9000))
  const name = (<HTMLInputElement>obsv_name).value
  const color = (<HTMLInputElement>obsv_col).value
  const sec_ = (<HTMLInputElement>obsv_sec).value
  console.info(`ID:${id_}, NAME:${name}, COL:${color}, SEC:${sec_}`)
  const sub = new Consumer(id_, name, Number(sec_), color) as ObserverMetadata<string>
  const unsub = producer.subscribe(sub)
  sub.unsub = unsub
  subscribers.set(id_, sub)
  logsubscribe()
}

function onunsubscribe(id: string) {
  const subscriber = subscribers.get(id);
  (<HTMLInputElement>obsv_name).value = subscriber!.name;
  (<HTMLInputElement>obsv_col).value = subscriber!.color ?? '';
  (<HTMLInputElement>obsv_sec).value = String(subscriber!.second) ?? "1";
  subscribers.delete(id)
  logsubscribe()
}

const producer = new Producer<string>();
let subscribers = new Map<string, ObserverMetadata<string>>()

/// event listeners!
subj_btn!.addEventListener('click', onnotify)
obsv_btn!.addEventListener('click', onsubscribe)
