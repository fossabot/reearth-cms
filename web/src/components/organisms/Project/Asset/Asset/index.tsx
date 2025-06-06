import { useParams } from "react-router-dom";

import Loading from "@reearth-cms/components/atoms/Loading";
import NotFound from "@reearth-cms/components/atoms/NotFound/partial";
import AssetWrapper from "@reearth-cms/components/molecules/Asset/Asset/AssetBody";
import CommentsPanel from "@reearth-cms/components/organisms/Common/CommentsPanel";
import useSettingsHooks from "@reearth-cms/components/organisms/Settings/General/hooks";

import useHooks from "./hooks";

const Asset: React.FC = () => {
  const { assetId } = useParams();
  const {
    asset,
    assetFileExt,
    isLoading,
    selectedPreviewType,
    isModalVisible,
    collapsed,
    viewerType,
    viewerRef,
    displayUnzipFileList,
    decompressing,
    isSaveDisabled,
    updateLoading,
    hasUpdateRight,
    handleAssetDecompress,
    handleAssetItemSelect,
    handleSingleAssetDownload,
    handleToggleCommentMenu,
    handleTypeChange,
    handleModalCancel,
    handleFullScreen,
    handleBack,
    handleSave,
  } = useHooks(assetId);

  const { workspaceSettings } = useSettingsHooks();

  if (isLoading) {
    return <Loading spinnerSize="large" minHeight="100vh" />;
  }

  if (!asset) {
    return <NotFound />;
  }

  return (
    <AssetWrapper
      commentsPanel={
        <CommentsPanel
          resourceId={asset.id}
          resourceType={"ASSET"}
          comments={asset.comments}
          threadId={asset.threadId}
          collapsed={collapsed}
          onCollapse={handleToggleCommentMenu}
          refetchQueries={["GetAssetItem"]}
        />
      }
      asset={asset}
      assetFileExt={assetFileExt}
      selectedPreviewType={selectedPreviewType}
      isModalVisible={isModalVisible}
      viewerType={viewerType}
      viewerRef={viewerRef}
      displayUnzipFileList={displayUnzipFileList}
      decompressing={decompressing}
      isSaveDisabled={isSaveDisabled}
      updateLoading={updateLoading}
      hasUpdateRight={hasUpdateRight}
      onAssetItemSelect={handleAssetItemSelect}
      onAssetDecompress={handleAssetDecompress}
      onAssetDownload={handleSingleAssetDownload}
      onTypeChange={handleTypeChange}
      onModalCancel={handleModalCancel}
      onChangeToFullScreen={handleFullScreen}
      onBack={handleBack}
      onSave={handleSave}
      workspaceSettings={workspaceSettings}
    />
  );
};

export default Asset;
