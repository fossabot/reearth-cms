package gql

import (
	"context"

	"github.com/reearth/reearth-cms/server/internal/adapter/gql/gqlmodel"
	"github.com/reearth/reearth-cms/server/internal/usecase/interfaces"
	"github.com/reearth/reearth-cms/server/pkg/asset"
	"github.com/reearth/reearth-cms/server/pkg/id"
	"github.com/reearth/reearthx/usecasex"
	"github.com/reearth/reearthx/util"
	"github.com/samber/lo"
)

type AssetLoader struct {
	usecase interfaces.Asset
}

func NewAssetLoader(usecase interfaces.Asset) *AssetLoader {
	return &AssetLoader{usecase: usecase}
}

func (c *AssetLoader) FindByID(ctx context.Context, assetId gqlmodel.ID) (*gqlmodel.Asset, error) {
	aid, err := gqlmodel.ToID[id.Asset](assetId)
	if err != nil {
		return nil, err
	}

	a, err := c.usecase.FindByID(ctx, aid, getOperator(ctx))
	if err != nil {
		return nil, err
	}

	return gqlmodel.ToAsset(a), nil
}

func (c *AssetLoader) FindByIDs(ctx context.Context, ids []gqlmodel.ID) ([]*gqlmodel.Asset, []error) {
	aIDs, err := util.TryMap(ids, gqlmodel.ToID[id.Asset])
	if err != nil {
		return nil, []error{err}
	}

	res, err := c.usecase.FindByIDs(ctx, aIDs, getOperator(ctx))
	if err != nil {
		return nil, []error{err}
	}

	return util.Map(aIDs, func(id asset.ID) *gqlmodel.Asset {
		a, ok := lo.Find(res, func(a *asset.Asset) bool {
			return a != nil && a.ID() == id
		})
		if !ok {
			return nil
		}
		return gqlmodel.ToAsset(a)
	}), nil
}

func (c *AssetLoader) Search(ctx context.Context, query gqlmodel.AssetQueryInput, sort *gqlmodel.AssetSort, pagination *gqlmodel.Pagination) (*gqlmodel.AssetConnection, error) {
	pID, err := gqlmodel.ToID[id.Project](query.Project)
	if err != nil {
		return nil, err
	}

	ct := lo.FilterMap(query.ContentTypes, func(ct gqlmodel.ContentTypesEnum, _ int) (string, bool) {
		ctStr := gqlmodel.FromContentType(ct)
		return ctStr, ctStr != ""
	})

	filter := interfaces.AssetFilter{
		Keyword:      query.Keyword,
		Sort:         sort.Into(),
		Pagination:   pagination.Into(),
		ContentTypes: ct,
	}

	assets, pi, err := c.usecase.Search(ctx, pID, filter, getOperator(ctx))
	if err != nil {
		return nil, err
	}

	edges := make([]*gqlmodel.AssetEdge, 0, len(assets))
	nodes := make([]*gqlmodel.Asset, 0, len(assets))
	for _, a := range assets {
		asset := gqlmodel.ToAsset(a)
		edges = append(edges, &gqlmodel.AssetEdge{
			Node:   asset,
			Cursor: usecasex.Cursor(asset.ID),
		})
		nodes = append(nodes, asset)
	}

	totalCount := 0
	if pi != nil {
		totalCount = int(pi.TotalCount)
	} else {
		totalCount = len(assets)
	}

	return &gqlmodel.AssetConnection{
		Edges:      edges,
		Nodes:      nodes,
		PageInfo:   gqlmodel.ToPageInfo(pi),
		TotalCount: totalCount,
	}, nil
}
