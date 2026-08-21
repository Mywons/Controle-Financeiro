# Controle Financeiro

App mobile de controle financeiro pessoal, feito com React Native + Expo.

## Funcionalidades

- **Dashboard** com saldo previsto do mês, % da renda comprometida, % de economia e gráfico de gastos por categoria.
- **Lançamentos** mensais (receitas e despesas), com marcação de pago/pendente, edição e exclusão.
- **Contas recorrentes e salário**: cadastre uma vez (valor, categoria, dia do mês) e o app gera os lançamentos automaticamente todo mês, conforme você navega entre os meses.
- Navegação entre meses com histórico e projeção automática.
- Dados salvos localmente no dispositivo (AsyncStorage) — uso pessoal, sem servidor.

## Como rodar

```bash
npm install
npx expo start
```

Abra no seu celular com o app **Expo Go** (escaneando o QR code), ou rode `npx expo start --android` / `--ios` / `--web`.

## Stack

- Expo + React Native + TypeScript
- Zustand (estado global com persistência)
- react-native-svg (gráfico de rosca do dashboard)
- AsyncStorage (persistência local)
