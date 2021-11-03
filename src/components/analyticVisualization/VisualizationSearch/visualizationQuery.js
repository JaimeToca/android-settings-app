export const getDashboardsQQuery = (query = '') => {
    return {
        resource: `visualizations`,
        params: {
            query,
            pageSize: 100,
            fields:
                'id,displayName,type,relativePeriods,rowDimensions,columnDimensions,userOrganisationUnit,userOrganisationUnitChildren,userOrganisationUnitGrandChildren',
            order: 'displayName:asc',
        },
    }
}
