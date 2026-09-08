# NgRx
***NgRx*** is a library base on ***Redux pattern***, It helps developers to manage their app-state, at scale.

## Architecture
---
![Architecture](https://wp.angular.love/wp-content/uploads/2024/07/content-image1-463.png)

1. **Store**: It has all *States* in one place. It is *Immutable*, so it can never be changed directly.
1. **Actions**: They take any, or none parameters, and trigger a function in *Reducer*.
1. **Reducer**: The set of functions, that take state, and any parameters, and return new *State*.
1. **Selectors**: It returns an specified *state* from *store* in an efficient way.
1. **Effects**: It runs as a result of some *actions*, in order to manage some eternal functioning.

## About App
It is a simple contact app, built by Angular, and NgRx.
___
It can:
- show users info.
- add a new user.
- delete selected users.
