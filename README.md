[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=smashedr_docker-tags-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=smashedr_docker-tags-action)
[![Tags](https://github.com/smashedr/docker-tags-action/actions/workflows/tags.yaml/badge.svg)](https://github.com/smashedr/docker-tags-action/actions/workflows/tags.yaml)
# Docker Tags Action

Generate Docker Tags. For a more detailed implementation see: https://github.com/docker/metadata-action

> [!NOTE]   
> Please submit a [Feature Request](https://github.com/smashedr/docker-tags-action/discussions/categories/feature-requests)
> for new features or [Open an Issue](https://github.com/smashedr/docker-tags-action/issues) if you find any bugs.

## Inputs

| input     | required | default | description                  |
|-----------|----------|---------|------------------------------|
| images    | Yes      | -       | Image to Generate Tag for    |
| extra     | No       | -       | Extra Tags to Generate       |
| seperator | No       | \n      | Tag Seperator for Output     |
| latest    | No       | default | `true` or `false` expression |

- **latest**: Default behavior only adds `latest` tag to a release that are not a pre-release.

### Outputs

| output | description              |
|--------|--------------------------|
| tags   | Tags Generated for Image |

```yaml
  - name: "Update Tags"
    uses: smashedr/docker-tags-action@master
    with:
      images: "ghcr.io/${{ github.repository }}"
```

## Examples

Coming Soon...
