import {
  Labeled,
  Show,
  SimpleShowLayout,
  TextField,
  useTranslate,
} from "react-admin";
import { Grid, Typography } from "@mui/material";
import { PostShowActions } from "../../components/helper";

export const RunShowLayout = () => {
  const translate = useTranslate();

  return (
      <Grid>
        <Typography variant="h6" gutterBottom>
          {translate("resources.run.title")}
        </Typography>
        <SimpleShowLayout>
          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6}>
              <Labeled label="My Label">
                <TextField source="name" />
              </Labeled>
            </Grid>
          </Grid>

        </SimpleShowLayout>
      </Grid>
  );
};
export const RunShow = () => {
  return (
    <Show
      actions={<PostShowActions />}
      sx={{ "& .RaShow-card": { width: "50%" } }}
    >
      <RunShowLayout />
    </Show>
  );
};
