<script setup>
import { ref } from 'vue'
import { CTable, CTableRow, CCol, CRow, CCollapse, CCard, CCardBody } from '@coreui/bootstrap-vue'

const visibleInfos = ref(false)
</script>

<template>
  <button
    class="btn btn-primary rounded-pill bg-white text-primary btn-sm"
    @click="visibleInfos = !visibleInfos"
  >
    <button
      class="btn btn-primary rounded-circle btn-sm"
      type="button"
      @mouseover="extendButton = !extendButton"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-info-circle"
      >
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
        <path
          d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
        />
      </svg>
    </button>
    About this graph
  </button>

  <CRow>
    <CCol>
      <CCollapse :visible="visibleInfos">
        <CCard>
          <CCardBody>
            <p>
              This graph is calculated with bootstrapping method. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Vivamus elementum sapien sed vulputate luctus. Proin
              volutpat vestibulum lacus, non hendrerit. Based on the following equation
            </p>
            <math display="block">
              <mi>T</mi>
              <mo>=</mo>
              <mrow>
                <mmultiscripts>
                  <mn>T</mn>
                  <mn>0</mn>
                </mmultiscripts>
                <mo>+</mo>
                <munderover>
                  <mo>∑</mo>
                  <mrow>
                    <mi>i</mi>
                    <mo>=</mo>
                    <mn>1</mn>
                  </mrow>
                  <mrow>
                    <mo>n</mo>
                  </mrow>
                </munderover>
                <mo>(</mo>
                <mfrac>
                  <mrow>
                    <msup>
                      <mrow>
                        <msub>
                          <mn>q</mn>
                          <mn
                            ><mmultiscripts>
                              <mn>i-1</mn>
                            </mmultiscripts>
                          </mn>
                        </msub>
                      </mrow>
                    </msup>
                    <msup>
                      <mrow>
                        <msub>
                          <mn>&Delta;</mn>
                          <mn
                            ><mmultiscripts>
                              <mn>Z</mn>
                              <mn>i</mn>
                            </mmultiscripts>
                          </mn>
                        </msub>
                      </mrow>
                    </msup>
                  </mrow>
                  <msup>
                    <munder>
                      <msup>
                        <mrow>
                          <msub>
                            <mn>k</mn>
                            <mn
                              ><mmultiscripts>
                                <mn>i</mn>
                              </mmultiscripts>
                            </mn>
                          </msub>
                        </mrow>
                      </msup>
                    </munder>
                  </msup>
                </mfrac>
                <mo>-</mo>
                <mfrac>
                  <mrow>
                    <msup>
                      <mrow>
                        <msub>
                          <mn>A</mn>
                          <mn
                            ><mmultiscripts>
                              <mn>i</mn>
                            </mmultiscripts>
                          </mn>
                        </msub>
                      </mrow>
                    </msup>
                    <msup>
                      <mrow>
                        <msub>
                          <mn>&Delta;</mn>
                          <mn
                            ><mmultiscripts>
                              <mn>Z</mn>
                              <mn>i</mn>
                            </mmultiscripts>
                          </mn>
                        </msub>
                      </mrow>
                      <mn>2</mn>
                    </msup>
                  </mrow>
                  <msup>
                    <msup>
                      <mrow>
                        <msub>
                          <mn>2k</mn>
                          <mn
                            ><mmultiscripts>
                              <mn>i</mn>
                            </mmultiscripts>
                          </mn>
                        </msub>
                      </mrow>
                    </msup>
                  </msup>
                </mfrac>
                <mo>)</mo>
              </mrow>
            </math>

            <p></p>

            <math display="block">
              <msup>
                <mrow>
                  <msub>
                    <mn>q</mn>
                    <mn
                      ><mmultiscripts>
                        <mn>i-1</mn>
                      </mmultiscripts>
                    </mn>
                  </msub>
                </mrow>
              </msup>
              <mo>=</mo>
              <msup>
                <mrow>
                  <msub>
                    <mn>q</mn>
                    <mn
                      ><mmultiscripts>
                        <mn>i</mn>
                      </mmultiscripts>
                    </mn>
                  </msub>
                </mrow>
              </msup>
              <mo>+</mo>
              <msup>
                <mrow>
                  <msub>
                    <mn>A</mn>
                    <mn
                      ><mmultiscripts>
                        <mn>i</mn>
                      </mmultiscripts>
                    </mn>
                  </msub>
                </mrow>
              </msup>
              <msup>
                <mrow>
                  <msub>
                    <mn>&Delta;</mn>
                    <mn
                      ><mmultiscripts>
                        <mn>Z</mn>
                        <mn>i</mn>
                      </mmultiscripts>
                    </mn>
                  </msub>
                </mrow>
              </msup>
            </math>

            <!-- Variables -->
            <CTable>
              <CTableRow>
                <math>
                  <mi>T</mi>
                  <mo>Temperature</mo>
                </math>
              </CTableRow>
              <CTableRow>
                <math>
                  <mmultiscripts>
                    <mn>T</mn>
                    <mn>0</mn>
                  </mmultiscripts>
                  <mo>Ground surface temperature</mo>
                </math>
              </CTableRow>
              <!-- qi-1 -->
              <CTableRow>
                <math
                  ><mmultiscripts>
                    <mn>q</mn>
                    <mn>i-1</mn>
                  </mmultiscripts>
                  <mo>Heat flow at the base of the i-th depth interval</mo>
                </math>
              </CTableRow>
              <CTableRow>
                <math>
                  <mmultiscripts>
                    <mn>q</mn>
                    <mn>i</mn>
                  </mmultiscripts>
                  <mo>Heat flow at the top of the i-th depth interval</mo>
                </math>
              </CTableRow>
              <!-- Delta -->
              <CTableRow>
                <math>
                  <msup>
                    <mrow>
                      <msub>
                        <mn>&Delta;</mn>
                        <mn
                          ><mmultiscripts>
                            <mn>Z</mn>
                            <mn>i</mn>
                          </mmultiscripts>
                        </mn>
                      </msub>
                    </mrow>
                  </msup>
                  <mo>Thickness of the i-th depth interval</mo>
                </math>
              </CTableRow>
              <!-- ki -->
              <CTableRow>
                <math>
                  <msup>
                    <mrow>
                      <msub>
                        <mn>k</mn>
                        <mn
                          ><mmultiscripts>
                            <mn>i</mn>
                          </mmultiscripts>
                        </mn>
                      </msub>
                    </mrow>
                  </msup>
                  <mo>In situ thermal conductivity</mo>
                </math>
              </CTableRow>
              <!-- Ai -->
              <CTableRow>
                <math>
                  <msup>
                    <mrow>
                      <msub>
                        <mn>A</mn>
                        <mn
                          ><mmultiscripts>
                            <mn>i</mn>
                          </mmultiscripts>
                        </mn>
                      </msub>
                    </mrow>
                  </msup>
                  <mo>Heat production</mo>
                </math>
              </CTableRow>
            </CTable>
          </CCardBody>
        </CCard>
      </CCollapse>
    </CCol>
  </CRow>
</template>
