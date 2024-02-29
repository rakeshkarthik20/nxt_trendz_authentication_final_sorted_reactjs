import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'
import './index.css'

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    /* here active activeOptionId is changing over the time , hence we are maintaining in the state 
     and we are initializing activeOptionId value with 1st option that is sortbyOptions[0].optionId */
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    const {activeOptionId} = this.state
    this.setState({
      isLoading: true,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}`
    // This apiurl something looks like  : https://apis.ccbp.in/products?sort_by=PRICE_HIGH
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        isLoading: false,
      })
    }
  }

  updateActiveOptionIdFunction = activeOptionIdValue => {
    this.setState(
      {
        activeOptionId: activeOptionIdValue,
      },
      this.getProducts,
      /* here this.getProducts is called in setState because , we must get getProducts items 
      only when activeOptionIdValue value is updated from (high to low) or (low to high)
      this activeOptionIdValue is updating in this  updateActiveOptionIdFunction , hence we are 
      setting this.getProducts in setState when (high to low) or (low to high) is changed , then we 
      get this.getProducts from accordingly (high to low) or (low to high) */

      /* if we call this.getProducts() function type directly , in  this.getProducts apiUrl it takes
      first initial activeOptionId only . it does not take changed activeOptionIdValue from (low to high)
      because we are not giving updated activeOptionIdValue to apiUrl by declaring outside the setState
      hence its important to set this.getProducts inside the setState  */
    )
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state
    return (
      <>
        <ProductsHeader
          sortbyOptions={sortbyOptions}
          activeOptionId={activeOptionId}
          updateActiveOptionId={this.updateActiveOptionIdFunction}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {isLoading} = this.state
    return isLoading ? this.renderLoader() : this.renderProductsList()
  }
}

export default AllProductsSection
