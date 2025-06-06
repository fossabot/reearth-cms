import styled from "@emotion/styled";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";

import Button from "@reearth-cms/components/atoms/Button";
import Divider from "@reearth-cms/components/atoms/Divider";
import Icon from "@reearth-cms/components/atoms/Icon";
import InnerContent from "@reearth-cms/components/atoms/InnerContents/basic";
import ContentSection from "@reearth-cms/components/atoms/InnerContents/ContentSection";
import Loading from "@reearth-cms/components/atoms/Loading";
import Switch from "@reearth-cms/components/atoms/Switch";
import Cards from "@reearth-cms/components/molecules/Settings/Cards";
import FormModal from "@reearth-cms/components/molecules/Settings/FormModal";
import {
  WorkspaceSettings,
  TileInput,
  TerrainInput,
} from "@reearth-cms/components/molecules/Workspace/types";
import { useT } from "@reearth-cms/i18n";

type Props = {
  loading: boolean;
  workspaceSettings: WorkspaceSettings;
  hasUpdateRight: boolean;
  updateLoading: boolean;
  onWorkspaceSettingsUpdate: (
    tiles: TileInput[],
    terrains: TerrainInput[],
    isEnable?: boolean,
  ) => Promise<void>;
};

const Settings: React.FC<Props> = ({
  loading,
  workspaceSettings,
  hasUpdateRight,
  updateLoading,
  onWorkspaceSettingsUpdate,
}) => {
  const t = useT();

  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<WorkspaceSettings>();
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setSettings(workspaceSettings);
  }, [workspaceSettings]);

  useEffect(() => {
    setIsDisabled(JSON.stringify(workspaceSettings) === JSON.stringify(settings));
  }, [workspaceSettings, settings]);

  const tiles: TileInput[] = useMemo(() => {
    if (!settings?.tiles?.resources) return [];
    return settings?.tiles?.resources?.map(resource => ({ tile: resource }));
  }, [settings]);

  const terrains: TerrainInput[] = useMemo(() => {
    if (!settings?.terrains?.resources) return [];
    return settings?.terrains?.resources?.map(resource => ({ terrain: resource }));
  }, [settings]);

  const isTileRef = useRef(true);
  const indexRef = useRef<undefined | number>(undefined);

  const onTileModalOpen = (index?: number) => {
    setOpen(true);
    isTileRef.current = true;
    indexRef.current = index;
  };

  const onTerrainModalOpen = (index?: number) => {
    setOpen(true);
    isTileRef.current = false;
    indexRef.current = index;
  };

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  const onChange = useCallback((checked: boolean) => {
    setSettings(prevState => {
      if (!prevState) return;
      const copySettings = structuredClone(prevState);
      if (copySettings.terrains) copySettings.terrains.enabled = checked;
      return copySettings;
    });
  }, []);

  const handleDelete = useCallback(
    (isTile: boolean, index: number) => {
      if (!settings) return;
      const copySettings = structuredClone(settings);
      if (isTile) {
        copySettings.tiles?.resources?.splice(index, 1);
      } else {
        copySettings.terrains?.resources?.splice(index, 1);
      }
      setSettings(copySettings);
    },
    [settings],
  );

  const handleDragEnd = useCallback(
    (fromIndex: number, toIndex: number, isTile: boolean) => {
      if (toIndex < 0) return;
      if (!settings) return;
      const copySettings = structuredClone(settings);
      if (isTile) {
        if (!copySettings.tiles?.resources) return;
        const [removed] = copySettings.tiles.resources.splice(fromIndex, 1);
        copySettings.tiles.resources.splice(toIndex, 0, removed);
      } else {
        if (!copySettings.terrains?.resources) return;
        const [removed] = copySettings.terrains.resources.splice(fromIndex, 1);
        copySettings.terrains.resources.splice(toIndex, 0, removed);
      }
      setSettings(copySettings);
    },
    [settings],
  );

  const handleWorkspaceSettingsSave = useCallback(() => {
    onWorkspaceSettingsUpdate(tiles, terrains, settings?.terrains?.enabled);
  }, [onWorkspaceSettingsUpdate, settings?.terrains?.enabled, terrains, tiles]);

  return loading ? (
    <Loading minHeight="400px" />
  ) : (
    <InnerContent title={t("Settings")}>
      <ContentSection
        title={t("Geospatial asset preview setting")}
        description={t("For asset viewer (formats like 3D Tiles, MVT, GeoJSON, CZML ... )")}>
        <Title>{t("Tiles")}</Title>
        <SecondaryText>{t("The first one in the list will be the default Tile.")}</SecondaryText>
        {settings?.tiles?.resources?.length ? (
          <Cards
            resources={settings?.tiles?.resources}
            onModalOpen={onTileModalOpen}
            isTile={true}
            onDelete={handleDelete}
            onDragEnd={handleDragEnd}
            hasUpdateRight={hasUpdateRight}
          />
        ) : null}
        <Button
          type="link"
          onClick={() => onTileModalOpen()}
          icon={<Icon icon="plus" />}
          disabled={!hasUpdateRight}>
          {t("Add new Tiles option")}
        </Button>
        <Divider />
        <Title>{t("Terrain")}</Title>
        <SecondaryText>{t("The first one in the list will be the default Terrain.")}</SecondaryText>
        <SwitchWrapper>
          <Switch
            checked={settings?.terrains?.enabled}
            onChange={onChange}
            disabled={!hasUpdateRight}
          />
          <Text>{t("Enable")}</Text>
        </SwitchWrapper>
        {settings?.terrains?.enabled && (
          <>
            {settings?.terrains?.resources?.length ? (
              <Cards
                resources={settings?.terrains?.resources}
                onModalOpen={onTerrainModalOpen}
                isTile={false}
                onDelete={handleDelete}
                onDragEnd={handleDragEnd}
                hasUpdateRight={hasUpdateRight}
              />
            ) : null}
            <Button
              type="link"
              onClick={() => onTerrainModalOpen()}
              icon={<Icon icon="plus" />}
              disabled={!hasUpdateRight}>
              {t("Add new Terrain option")}
            </Button>
          </>
        )}
        <ButtonWrapper>
          <Button
            type="primary"
            onClick={handleWorkspaceSettingsSave}
            disabled={isDisabled}
            loading={updateLoading}>
            {t("Save")}
          </Button>
        </ButtonWrapper>
        <FormModal
          open={open}
          onClose={onClose}
          tiles={tiles}
          terrains={terrains}
          setSettings={setSettings}
          isTile={isTileRef.current}
          index={indexRef.current}
        />
      </ContentSection>
    </InnerContent>
  );
};

export default Settings;

const Title = styled.h3`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 4px;
`;

const SecondaryText = styled.p`
  color: #00000073;
  margin-bottom: 12px;
`;

const Text = styled.p`
  color: rgb(0, 0, 0, 0.85);
  font-weight: 500;
`;

const SwitchWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const ButtonWrapper = styled.div`
  padding: 12px 0;
`;
