import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LoadingIndicator,
  SortPayload,
  useCreatePath,
  useDataProvider,
  useTranslate,
} from "react-admin";
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Container,
  Grid,
  Button,
  Box,
  Typography,
  List,
  ListItem,
} from "@mui/material";

import { PageTitle } from "../components/pageTitle";
import LaunchIcon from "@mui/icons-material/Launch";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import TableChartIcon from "@mui/icons-material/TableChart";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { grey } from "@mui/material/colors";

import { useRootSelector } from "@dslab/ra-root-selector";

export const Dashboard = () => {
  const dataProvider = useDataProvider();
  const { root: projectId } = useRootSelector();
  const translate = useTranslate();
  const createPath = useCreatePath();

  const [project, setProject] = useState<any>();

  const [functions, setFunctions] = useState<any[]>();
  const [artifacts, setArtifacts] = useState<any[]>();
  const [dataItems, setDataItems] = useState<any[]>();

  useEffect(() => {
    if (dataProvider && projectId) {
      dataProvider.getOne("projects", { id: projectId }).then((res) => {
        if (res.data) {
          setProject(res.data);
        }
      });
      const params = {
        pagination: { page: 1, perPage: 5 },
        sort: { field: "updated", order: "DESC" } as SortPayload,
        filter: {},
      };
      dataProvider.getList("functions", params).then((res) => {
        if (res.data) {
          setFunctions(res.data);
        }
      });
      dataProvider.getList("artifacts", params).then((res) => {
        if (res.data) {
          setArtifacts(res.data);
        }
      });
      dataProvider.getList("dataitems", params).then((res) => {
        if (res.data) {
          setDataItems(res.data);
        }
      });
    }
  }, [dataProvider, projectId]);

  if (!project) {
    return <LoadingIndicator />;
  }

  return (
    <Container maxWidth="lg">
      <div>
        <PageTitle
          text={project.name}
          secondaryText={translate("pages.dashboard.description")}
          icon={<DashboardIcon fontSize={"large"} />}
          sx={{ pb: 0 }}
        />
        <Box color={grey[500]} sx={{ pt: 0, pb: 1, textAlign: "left" }}>
          {project.metadata && (
            <List sx={{ pt: 0 }}>
              <ListItem disableGutters sx={{ pt: 0 }}>
                {translate("field.updated")} {project.metadata.updated}
              </ListItem>
              <ListItem disableGutters sx={{ pt: 0 }}>
                {translate("field.created")} {project.metadata.created}
              </ListItem>
            </List>
          )}
        </Box>
      </div>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4} zeroMinWidth>
          <Card sx={{ height: "100%" }}>
            <CardHeader
              title={translate("pages.dashboard.functions.title")}
              avatar={<ElectricBoltIcon />}
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
              {translate("pages.dashboard.functions.description")}

              {!!functions && functions.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {translate("ra.action.list")}
                  {": "}
                  <List sx={{ pt: 0 }}>
                    {functions.map((f) => (
                      <ListItem disableGutters sx={{ pt: 0 }}>
                        <Link
                          to={createPath({
                            type: "show",
                            resource: "functions",
                            id: f.id,
                          })}
                        >
                          {f.metadata.name || f.name}
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
            <CardActions>
              <Button
                component={Link}
                to={createPath({ type: "list", resource: "functions" })}
                size="small"
                endIcon={<LaunchIcon />}
              >
                {translate("ra.action.open")}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4} zeroMinWidth>
          <Card sx={{ height: "100%" }}>
            <CardHeader
              title={translate("pages.dashboard.artifacts.title")}
              avatar={<InsertDriveFileIcon />}
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
              {translate("pages.dashboard.artifacts.description")}
              {!!artifacts && artifacts.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {translate("ra.action.list")}
                  {": "}
                  <List sx={{ pt: 0 }}>
                    {artifacts.map((f) => (
                      <ListItem disableGutters sx={{ pt: 0 }}>
                        <Link
                          to={createPath({
                            type: "show",
                            resource: "artifacts",
                            id: f.id,
                          })}
                        >
                          {f.metadata.name || f.name}
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
            <CardActions>
              <Button
                component={Link}
                to={createPath({ type: "list", resource: "artifacts" })}
                size="small"
                endIcon={<LaunchIcon />}
              >
                {translate("ra.action.open")}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4} zeroMinWidth>
          <Card sx={{ height: "100%" }}>
            <CardHeader
              title={translate("pages.dashboard.dataitems.title")}
              avatar={<TableChartIcon />}
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
              {translate("pages.dashboard.dataitems.description")}
              {!!dataItems && dataItems.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {translate("ra.action.list")}
                  {": "}
                  <List sx={{ pt: 0 }}>
                    {dataItems.map((f) => (
                      <ListItem disableGutters sx={{ pt: 0 }}>
                        <Link
                          to={createPath({
                            type: "show",
                            resource: "dataitems",
                            id: f.id,
                          })}
                        >
                          {f.metadata.name || f.name}
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
            <CardActions>
              <Button
                component={Link}
                to={createPath({ type: "list", resource: "dataitems" })}
                size="small"
                endIcon={<LaunchIcon />}
              >
                {translate("ra.action.open")}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="body1" sx={{ mt: 2, pt: 1, pb: 1 }}>
        {translate("pages.dashboard.text")}
      </Typography>
    </Container>
  );
};
