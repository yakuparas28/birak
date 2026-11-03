import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconName =
  | 'home'
  | 'pulse'
  | 'people'
  | 'user'
  | 'bell'
  | 'back'
  | 'close'
  | 'check'
  | 'lock'
  | 'chevron'
  | 'plus'
  | 'pen'
  | 'badge'
  | 'drop'
  | 'walk'
  | 'phone'
  | 'heart'
  | 'chat'
  | 'money'
  | 'trash';

type Props = { name: IconName; size?: number; color: string; strokeWidth?: number };

export function Icon({ name, size = 24, color, strokeWidth = 1.8 }: Props) {
  const common = {
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no">
      {name === 'home' && <Path {...common} d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />}
      {name === 'pulse' && <Path {...common} d="M3 12h4l3-8 4 16 3-8h4" />}
      {name === 'people' && (
        <>
          <Circle {...common} cx={9} cy={8} r={3.5} />
          <Path {...common} d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5" />
          <Path {...common} d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c2.2.6 3.5 2.4 3.5 5.2" />
        </>
      )}
      {name === 'user' && (
        <>
          <Circle {...common} cx={12} cy={8} r={4} />
          <Path {...common} d="M4 21c0-4 4-6 8-6s8 2 8 6" />
        </>
      )}
      {name === 'bell' && (
        <>
          <Path {...common} d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <Path {...common} d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </>
      )}
      {name === 'back' && <Path {...common} d="M15 18l-6-6 6-6" />}
      {name === 'close' && <Path {...common} d="M6 6l12 12M18 6L6 18" />}
      {name === 'check' && <Path {...common} d="M5 12l5 5 9-10" />}
      {name === 'lock' && (
        <>
          <Rect {...common} x={5} y={11} width={14} height={10} rx={2} />
          <Path {...common} d="M8 11V7a4 4 0 0 1 8 0v4" />
        </>
      )}
      {name === 'chevron' && <Path {...common} d="M9 6l6 6-6 6" />}
      {name === 'plus' && <Path {...common} d="M12 5v14M5 12h14" />}
      {name === 'pen' && <Path {...common} d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" />}
      {name === 'badge' && (
        <>
          <Circle {...common} cx={12} cy={9} r={6} />
          <Path {...common} d="M8.5 14 7 22l5-3 5 3-1.5-8" />
        </>
      )}
      {name === 'drop' && <Path {...common} d="M12 2.5s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />}
      {name === 'walk' && (
        <>
          <Circle {...common} cx={13} cy={4} r={2} />
          <Path {...common} d="M9 21l2-6 3 3v3M7 12l3-4 4 1 3 3" />
        </>
      )}
      {name === 'phone' && (
        <Path {...common} d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
      )}
      {name === 'heart' && <Path {...common} d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11z" />}
      {name === 'chat' && <Path {...common} d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />}
      {name === 'money' && <Path {...common} d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />}
      {name === 'trash' && <Path {...common} d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3" />}
    </Svg>
  );
}
