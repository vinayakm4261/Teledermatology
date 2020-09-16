import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';
import Animated from 'react-native-reanimated';

const Action = (props) => {
  const theme = useTheme();

  return <Appbar.Action color={theme.colors.greyDark} {...props} />;
};

const BackAction = (props) => {
  const theme = useTheme();

  return <Appbar.BackAction color={theme.colors.greyDark} {...props} />;
};

const Content = ({ titleStyle, ...props }) => {
  const theme = useTheme();

  return (
    <Appbar.Content
      titleStyle={{
        fontSize: 28,
        lineHeight: 36,
        marginVertical: 8,
        letterSpacing: -0.5,
        color: theme.colors.greyDark,
        ...theme.fonts.medium,
        ...titleStyle,
      }}
      {...props}
    />
  );
};

const AnimatedAppbarHeader = Animated.createAnimatedComponent(Appbar.Header);

const Header = ({
  children,
  theme: { colors, ...restTheme } = {},
  animated = false,
  style,
  ...props
}) => {
  const theme = useTheme();

  return animated ? (
    <AnimatedAppbarHeader
      theme={{
        colors: { primary: theme.colors.background, ...colors },
        ...restTheme,
      }}
      style={{ elevation: 0, ...style }}
      {...props}>
      {children}
    </AnimatedAppbarHeader>
  ) : (
    <Appbar.Header
      theme={{
        colors: { primary: theme.colors.background, ...colors },
        ...restTheme,
      }}
      style={{ elevation: 0, ...style }}
      {...props}>
      {children}
    </Appbar.Header>
  );
};

export default { Action, BackAction, Content, Header };
