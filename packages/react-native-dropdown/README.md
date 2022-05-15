# @crosscement/react-native-dropdown

A simple and easy to use dropdown component.

[![npm](https://img.shields.io/npm/v/@crosscement/react-native-dropdown)](https://www.npmjs.com/package/@crosscement/react-native-dropdown)

## Sample

![](./demo.gif)

## Installation

```sh
npm install @crosscement/react-native-dropdown
```

## Usage

```tsx
<Dropdown
  visible={visible}
  expand={
    <View style={{ height, backgroundColor: 'yellow' }}>
      <Button title="hide" onPress={hide} />
    </View>
  }
  onDismiss={hide}
>
  <Button title="show dynamic container" onPress={show} />
</Dropdown>
```

## License

MIT
