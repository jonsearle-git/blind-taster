import Svg, { Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export function Sparkle({ size = 24, color = '#FFFFFF' }: Props): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 0 C12 7, 17 12, 24 12 C17 12, 12 17, 12 24 C12 17, 7 12, 0 12 C7 12, 12 7, 12 0 Z"
        fill={color}
      />
    </Svg>
  );
}
