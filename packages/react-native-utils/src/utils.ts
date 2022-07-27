export function shallowDiffers(prev: Object, next: Object): boolean {
  for (const attribute in prev) {
    if (!(attribute in next)) {
      return true;
    }
  }
  for (const attribute in next) {
    // @ts-ignore
    if (prev[attribute] !== next[attribute]) {
      return true;
    }
  }
  return false;
}

export function areEqual(prevProps: Object, nextProps: Object): boolean {
  const { style: prevStyle, ...prevRest } = prevProps as any;
  const { style: nextStyle, ...nextRest } = nextProps as any;

  return (
    !shallowDiffers(prevStyle, nextStyle) && !shallowDiffers(prevRest, nextRest)
  );
}

export function pick<T extends object, U extends keyof T>(
  props: T,
  paths: ReadonlyArray<U>
): Pick<T, U> {
  let index = -1,
    length = paths.length,
    result = {} as Pick<T, U>;

  while (++index < length) {
    let path = paths[index];
    result[path] = props[path];
  }
  return result;
}

/**
 * generate GUID
 * @returns GUID
 */
export const generateGUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
