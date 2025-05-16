export const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  height: '100vh',
  maxWidth: '100%',
  overflow: 'hidden'
};

export const videoSectionStyle = {
  width: '100%',
  height: '40vh',
  backgroundColor: 'black',
  position: 'relative' as const
};

export const videoFrameStyle = {
  border: 'none',
  width: '100%',
  height: '100%'
};

export const contentSectionStyle = {
  backgroundColor: 'white',
  flex: 1,
  display: 'flex',
  flexDirection: 'column' as const,
  borderTopLeftRadius: '20px',
  borderTopRightRadius: '20px',
  marginTop: '-10px',
  height: 'calc(60vh - 20px)',
  overflow: 'hidden'
};

export const titleSectionStyle = {
  padding: '16px',
  borderBottom: '1px solid #f0f0f0'
};

export const titleStyle = {
  margin: '0 0 8px 0',
  fontSize: '18px'
};

export const metaRowStyle = {
  display: 'flex',
  alignItems: 'center'
};

export const channelStyle = {
  fontSize: '14px',
  color: '#666'
};

export const dotStyle = {
  margin: '0 6px',
  color: '#666'
};

export const dateStyle = {
  fontSize: '14px',
  color: '#666'
};

export const viewsStyle = {
  fontSize: '14px',
  color: '#666'
};

export const tabContainerStyle = {
  display: 'flex',
  borderBottom: '1px solid #f0f0f0'
};

export const tabStyle = (isActive: boolean) => ({
  padding: '12px 16px',
  fontWeight: isActive ? 'bold' : 'normal',
  borderBottom: isActive ? '2px solid #2196F3' : 'none',
  cursor: 'pointer'
});

export const contentStyle = {
  flex: 1,
  overflowY: 'auto' as const,
  padding: '16px',
  paddingBottom: '80px'
};

export const textStyle = {
  margin: 0,
  fontSize: '14px',
  lineHeight: '1.5',
  whiteSpace: 'pre-line' as const
};

export const loadingContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  padding: '20px'
};

export const noCommentsStyle = {
  padding: '20px',
  textAlign: 'center' as const,
  color: '#666'
};

export const backButtonStyle = {
  position: 'fixed' as const,
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#2196F3',
  color: 'white',
  border: 'none',
  borderRadius: '30px',
  padding: '12px 40px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  zIndex: 1000
};

// Web comment styles
export const commentItemStyle = {
  display: 'flex',
  marginBottom: '16px',
  paddingBottom: '12px',
  borderBottom: '1px solid #f0f0f0'
};

export const commentAvatarStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '18px',
  marginRight: '12px'
};

export const commentContentStyle = {
  flex: 1
};

export const commentHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '4px'
};

export const commentAuthorStyle = {
  fontSize: '14px',
  fontWeight: 'bold',
  marginRight: '8px'
};

export const commentDateStyle = {
  fontSize: '12px',
  color: '#666'
};

export const commentTextStyle = {
  margin: '0 0 8px 0',
  fontSize: '14px',
  lineHeight: '1.4'
};

export const likesStyle = {
  fontSize: '12px',
  color: '#666'
}; 