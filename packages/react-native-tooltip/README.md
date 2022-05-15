# @crosscement/react-native-tooltip

A simple and easy to use tooltip component.

[![npm](https://img.shields.io/npm/v/@crosscement/react-native-tooltip)](https://www.npmjs.com/package/@crosscement/react-native-tooltip)

## Sample

<img src="./demo.gif" width="200" />

## Installation

```sh
npm install @crosscement/react-native-tooltip
```

## Usage

```tsx
<Tooltip
  visible={visible}
  content={<Text>tooltip</Text>}
  placement="bottom"
  contentStyle={{
    maxWidth: 100,
  }}
>
  <Button title="toggle" onPress={() => setVisible(!visible)} />
</Tooltip>
```

## License

MIT
