やること
- 正解したら、回答できなかったユーザーに正誤表示する
- 間違えたら、相手に解答権が映るようにする

### リクエスト数が多すぎるので、どうにかしたい
　一瞬で無料枠突破しそう

## emulatorを使ってfirestoreにデータを流し込みたいとき

下記の二つのコマンドを`packeage.json`に追加して下さい。
` "emulators": "firebase emulators:start --import=./firestoreData --export-on-exit=./firestoreData",`

今ある`"dev"コマンド`を削除して、下記のコマンドを追加してください。
` "dev": "nuxt dev && firebase emulators:start --import=./firestoreData --export-on-exit=./firestoreData",`


vscodeの`command+S`を押したらeslintの設定が走るようにする