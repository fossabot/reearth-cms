import styled from "@emotion/styled";
import { Viewer as CesiumViewer } from "cesium";
import { RefObject } from "react";
import { CesiumComponentRef } from "resium";

import Button from "@reearth-cms/components/atoms/Button";
import ComplexInnerContents from "@reearth-cms/components/atoms/InnerContents/complex";
import PageHeader from "@reearth-cms/components/atoms/PageHeader";
import AssetMolecule from "@reearth-cms/components/molecules/Asset/Asset/AssetBody/Asset";
import { PreviewType } from "@reearth-cms/components/molecules/Asset/Asset/AssetBody/previewTypeSelect";
import { Asset, AssetItem, ViewerType } from "@reearth-cms/components/molecules/Asset/types";
import { WorkspaceSettings } from "@reearth-cms/components/molecules/Workspace/types";
import { useT } from "@reearth-cms/i18n";

type Props = {
  commentsPanel: JSX.Element;
  asset: Asset;
  assetFileExt?: string;
  selectedPreviewType?: PreviewType;
  isModalVisible: boolean;
  viewerType?: ViewerType;
  viewerRef: RefObject<CesiumComponentRef<CesiumViewer>>;
  displayUnzipFileList: boolean;
  decompressing: boolean;
  isSaveDisabled: boolean;
  updateLoading: boolean;
  hasUpdateRight: boolean;
  onAssetItemSelect: (item: AssetItem) => void;
  onAssetDecompress: (assetId: string) => void;
  onAssetDownload: (asset: Asset) => Promise<void>;
  onTypeChange: (value: PreviewType) => void;
  onModalCancel: () => void;
  onChangeToFullScreen: () => void;
  onBack: () => void;
  onSave: () => void;
  workspaceSettings: WorkspaceSettings;
};

const AssetWrapper: React.FC<Props> = ({
  asset,
  assetFileExt,
  selectedPreviewType,
  isModalVisible,
  viewerType,
  viewerRef,
  displayUnzipFileList,
  decompressing,
  commentsPanel,
  isSaveDisabled,
  updateLoading,
  hasUpdateRight,
  onAssetItemSelect,
  onAssetDecompress,
  onAssetDownload,
  onTypeChange,
  onModalCancel,
  onChangeToFullScreen,
  onBack,
  onSave,
  workspaceSettings,
}) => {
  const t = useT();

  return (
    <ComplexInnerContents
      center={
        <Wrapper>
          <PageHeader
            title={`${t("Asset")} / ${asset?.fileName}`}
            extra={
              <Button onClick={onSave} disabled={isSaveDisabled} loading={updateLoading}>
                {t("Save")}
              </Button>
            }
            onBack={onBack}
          />
          <AssetMolecule
            asset={asset}
            assetFileExt={assetFileExt}
            selectedPreviewType={selectedPreviewType}
            isModalVisible={isModalVisible}
            viewerType={viewerType}
            viewerRef={viewerRef}
            displayUnzipFileList={displayUnzipFileList}
            decompressing={decompressing}
            hasUpdateRight={hasUpdateRight}
            onAssetDecompress={onAssetDecompress}
            onAssetItemSelect={onAssetItemSelect}
            onAssetDownload={onAssetDownload}
            onTypeChange={onTypeChange}
            onModalCancel={onModalCancel}
            onChangeToFullScreen={onChangeToFullScreen}
            workspaceSettings={workspaceSettings}
          />
        </Wrapper>
      }
      right={commentsPanel}
    />
  );
};

export default AssetWrapper;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
`;
