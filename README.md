# setup-object-storage

配置 对象存储 命令行工具

# Usage

See [action.yml](action.yml)

1. 用例(COSCMD):

```yaml
steps:
  - uses: actions/checkout@v3

  - name: Setup Python
    uses: actions/setup-python@v3.1.2
    with:
      python-version: '3.9'

  - name: Install COSCMD
    run: |
      pip install coscmd
      pip install coscmd -U

  - name: Setup COSCMD
    uses: sushi-su/setup-object-storage@v1.0.0
    with:
      util-type: coscmd
      secret-id: ${{ secrets.SECRET_ID }}
      secret-key: ${{ secrets.SECRET_KEY }}
      bucketname-appid: ${{ secrets.BUCKET }}
      region: ${{ secrets.REGION }}
      token: ${{ secrets.TOKEN }} # 可选参数
      endpoint: ${{ secrets.ENDPOINT }} # 可选参数
      max-thread: ${{ secrets.MAX_THREAD }} # 可选参数
      part-size: ${{ secrets.PART_SIZE }} # 可选参数
      do-not-use-ssl: ${{ secrets.DO_NOT_USE_SSL }} # 可选参数
      anonymous: ${{ secrets.ANONYMOUS }} # 可选参数

  - name: Deploy
    run: coscmd upload action.yml /
```
[详细用法参考，腾讯云 COSCMD 帮助文档](https://cloud.tencent.com/document/product/436/10976)

2. 用例(OSSUtil):

```yaml
steps:
  - uses: actions/checkout@v3
  - name: Setup OSSUtil
    uses: sushi-su/setup-object-storage@v1.0.0
    with:
      util-type: ossutil
      endpoint: ${{ secrets.ENDPOINT }}
      access-key-id: ${{ secrets.ACCESS_KEY_ID }}
      access-key-secret: ${{ secrets.ACCESS_KEY_SECRET }}
      sts-token: ${{ secrets.STS_TOKEN }} # 可选参数
      version: "1.7.10" # 可选参数
      
  - name: Deploy
    run: ossutil cp -rf action.yml oss://bucket/path
```
[详细用法参考，阿里云 OSSUtil 帮助文档](https://help.aliyun.com/document_detail/50452.html)

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
