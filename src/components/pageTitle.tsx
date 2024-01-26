import { Typography, Paper, Box, SxProps, Theme } from "@mui/material";
import { isValidElement, ReactElement } from "react";

export const PageTitle = (props: PageTitleProps) => {
  const { text, secondaryText, icon, sx } = props;
  const sxProps = { p: 0, pl: 0, pr: 0, pt: 2, pb: 2, display: "flex", ...sx };

  return (
    <Box sx={sxProps}>
      <Paper elevation={0} sx={{ textAlign: "left", flexGrow: 1 }}>
        <Typography
          variant="h4"
          sx={{ pt: 0, pb: 1, textAlign: "left" }}
          color={"secondary"}
        >
          {text}
        </Typography>
        {secondaryText && (
          <Typography variant="h6" sx={{ pt: 0, pb: 1, textAlign: "left" }}>
            {secondaryText}
          </Typography>
        )}
      </Paper>
      {icon && isValidElement(icon) ? (
        <Box sx={{ pt: 2, pb: 2, textAlign: "right" }}> {icon} </Box>
      ) : (
        ""
      )}
    </Box>
  );
};

export interface PageTitleProps {
  text: string;
  secondaryText?: string;
  icon?: ReactElement;
  sx?: SxProps<Theme>;
}
