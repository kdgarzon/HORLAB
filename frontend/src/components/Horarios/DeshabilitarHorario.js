import { Tooltip } from "@mui/material";

export const WithOptionalTooltip = ({ disabled, title, children }) => {
  return disabled ? (
    <Tooltip title={title} arrow placement="top">
      <span /*style={{ display: 'inline-block' }}*/>{children}</span>
    </Tooltip>
  ) : (
    children
  );
};
